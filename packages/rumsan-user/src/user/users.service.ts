import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@rumsan/prisma/client';
import { AuthService, CUI, tRC, User, UserRole } from '@rumsan/sdk/types';
import { paginator, PaginatorTypes } from '@rumsan/sdk/utils';
import { ERRORS, EVENTS } from '../constants';
import { createChallenge, decryptChallenge } from '../utils/challenge.utils';
import { getSecret } from '../utils/config.utils';
import {
  getServiceTypeByAddress,
  getVerificationEventName,
} from '../utils/service.utils';
import { CreateUserDto, ListUserDto, UpdateUserDto } from './dtos';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
// type PrismaClientType = Omit<
//   PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//   '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
// >;

class Details {
  extras: Record<string, any>;
}

@Injectable()
export class UsersService {
  constructor(
    protected prisma: PrismaClient,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    dto: CreateUserDto,
    callback?: (err: Error | null, tx: any, user: User | null) => void,
  ): Promise<User> {
    return this.prisma.$transaction(async (tx) => {
      try {
        const { roles, details, ...data } = dto;
        const userPayload: User = { ...data, cuid: createId() };

        const user: User = (await tx.user.create({
          data: userPayload,
        })) as User;

        if (details) {
          await tx.userDetails.create({
            data: { cuid: user.cuid, ...details },
          });
        }

        if (roles?.length) {
          await this.addRoles(user.cuid as string, roles, tx);
        }

        await Promise.all([
          this._createAuth(
            user.cuid,
            AuthService.EMAIL,
            user.email as string,
            tx,
          ),
          this._createAuth(
            user.cuid,
            AuthService.PHONE,
            user.phone as string,
            tx,
          ),
          this._createAuth(
            user.cuid,
            AuthService.WALLET,
            user.wallet as string,
            tx,
          ),
        ]);

        if (callback) {
          await callback(null, tx, user);
        }

        user.details = details;

        this.eventEmitter.emit(EVENTS.USER_CREATED, {
          user,
        });

        return user;
      } catch (error: any) {
        if (callback) {
          await callback(error, tx, null);
        }
        throw error;
      }
    });
  }

  private async _createAuth(
    userId: string,
    service: AuthService,
    serviceId: string | null,
    prisma: any,
  ): Promise<void> {
    if (!prisma) prisma = this.prisma;
    if (serviceId) {
      await prisma.auth.create({
        data: { userId, service, serviceId },
      });
    }
  }

  async list(dto: ListUserDto): Promise<PaginatorTypes.PaginatedResult<User>> {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[dto.sort] = dto.order;
    return paginate(
      this.prisma.user,
      {
        where: {
          deletedAt: null,
        },
        include: {
          details: true,
        },
        orderBy,
      },
      {
        page: dto.page,
        perPage: dto.limit,
      },
    );
  }

  getById(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        details: true,
        UserRoles: {
          include: {
            Role: true,
          },
        },
      },
    });
  }

  async get(cuid: string, prisma?: any) {
    if (!prisma) prisma = this.prisma;
    const user = await prisma.user.findUnique({
      where: { cuid, deletedAt: null },
      include: {
        UserRoles: {
          include: {
            Role: true,
          },
        },
        details: true,
      },
    });
    return user;
  }

  async update(cuid: string, dto: UpdateUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = (await this.prisma.user.findUnique({
        where: { cuid, deletedAt: null },
      })) as User;

      if (!user) throw ERRORS.USER_NOT_FOUND;

      const { details, ...data } = dto;

      // Update user details
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data,
        include: {
          details: true,
        },
      });

      if (details) {
        await tx.userDetails.update({
          data: { cuid: user.cuid, ...details },
          where: { cuid: user.cuid },
        });
      }

      // Update authentication details only if corresponding DTO field is provided
      await this._updateAuth(tx, user, AuthService.EMAIL, dto.email);
      await this._updateAuth(tx, user, AuthService.PHONE, dto.phone);
      await this._updateAuth(tx, user, AuthService.WALLET, dto.wallet);

      return updatedUser;
    });
  }

  private async _updateAuth(
    tx: any,
    user: User,
    service: AuthService,
    newServiceId?: string | null,
  ): Promise<void> {
    if (newServiceId) {
      const existingAuth = await tx.auth.findFirst({
        where: {
          userId: user.cuid,
          service,
        },
      });

      if (existingAuth) {
        // If there is an existing authentication entry, update it
        await tx.auth.update({
          where: { id: existingAuth.id },
          data: { serviceId: newServiceId },
        });
      } else {
        // If there is no existing entry, create a new one
        await tx.auth.create({
          data: { userId: user.cuid, service, serviceId: newServiceId },
        });
      }
    }
  }

  async updateMe(userId: string, dto: UpdateUserDto, rdetails: tRC) {
    return this.prisma.$transaction(async (tx) => {
      const user = await this.prisma.user.findUnique({
        where: { cuid: userId, deletedAt: null },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      const { email, phone, wallet, ...data } = dto;

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        include: {
          details: true,
        },
        data,
      });

      // Helper function to create a verification challenge and emit an event
      const emitVerificationEvent = async (
        service: AuthService,
        address?: string,
      ) => {
        if (address) {
          const { challenge } = createChallenge(getSecret(), {
            address,
            ip: rdetails.ip,
            data: { userId: user.id },
          });
          this.eventEmitter.emit(getVerificationEventName(service), {
            address,
            challenge,
          });
        }
      };

      // Emit verification events for email, phone, and wallet
      await emitVerificationEvent(AuthService.EMAIL, email);
      await emitVerificationEvent(AuthService.PHONE, phone);
      await emitVerificationEvent(AuthService.WALLET, wallet);

      return updatedUser;
    });
  }

  async processVerificationChallenge(challenge: string, rdetails: tRC) {
    const payload = decryptChallenge(getSecret(), challenge, 1200);

    if (!payload.address) {
      throw new Error('Invalid challenge');
    }

    if (payload.ip !== rdetails.ip) {
      // IP in challenge doesn't match the incoming IP
      throw new Error('IP mismatch');
    }

    const user = (await this.prisma.user.findUnique({
      where: { id: payload.data['userId'], deletedAt: null },
    })) as User;

    if (!user) {
      throw new Error('User not found');
    }

    const service = getServiceTypeByAddress(payload.address);
    if (!service) {
      throw new Error('Invalid service');
    }

    const data: { email?: string; phone?: string; wallet?: string } = {};
    if (service === AuthService.EMAIL) data.email = payload.address;
    if (service === AuthService.PHONE) data.phone = payload.address;
    if (service === AuthService.WALLET) data.wallet = payload.address;

    await this.prisma.$transaction(async (tx) => {
      await this._updateAuth(tx, user, service, payload.address);
      await tx.user.update({
        where: { id: user.id },
        include: {
          details: true,
        },
        data,
      });
    });
  }

  //soft delete user
  async delete(cuid: string, cui: CUI) {
    try {
      const user = await this.prisma.user.update({
        where: { cuid },
        data: { deletedAt: new Date(), updatedBy: cui.cuid },
      });
      return user;
    } catch (err) {
      throw new Error('rs-user: User not found or deletion not permitted.');
    }
  }

  async listRoles(cuid: string, prisma?: any): Promise<UserRole[]> {
    if (!prisma) prisma = this.prisma;
    const user = await this.get(cuid, prisma);
    if (!user) throw ERRORS.USER_NOT_FOUND;
    const roles = await prisma.userRole.findMany({
      where: { userId: user?.cuid },
      include: { Role: true },
    });

    return roles.map((role) => ({
      id: role.id,
      userId: role.userId,
      roleId: role.roleId,
      expiry: role.expiry,
      name: role.Role.name,
      createdAt: role.createdAt,
      createdBy: role.createdBy,
    }));
  }

  async addRoles(cuid: string, roles: string[], prisma?: any) {
    if (!prisma) prisma = this.prisma;

    const getValidRoles = await prisma.role.findMany({
      where: { name: { in: roles, mode: 'insensitive' } },
    });
    if (getValidRoles.length < 1) return [];
    const user = await prisma.user.findUnique({
      where: { cuid },
    });
    if (!user) throw ERRORS.USER_NOT_FOUND;

    await prisma.userRole.createMany({
      data: getValidRoles.map((role) => ({
        userId: user.cuid,
        roleId: role.cuid,
      })),
      skipDuplicates: true,
    });
    return this.listRoles(cuid, prisma);
  }

  async removeRoles(cuid: string, roles: string[], prisma?: any) {
    if (!prisma) prisma = this.prisma;
    const getValidRoles = await prisma.role.findMany({
      where: { name: { in: roles, mode: 'insensitive' } },
    });
    if (getValidRoles.length < 1) this.listRoles(cuid);
    const user = await prisma.user.findUnique({
      where: { cuid },
    });
    if (!user) throw ERRORS.USER_NOT_FOUND;

    await prisma.userRole.deleteMany({
      where: {
        userId: user.cuid,
        roleId: { in: getValidRoles.map((role) => role.cuid) },
      },
    });
    return this.listRoles(cuid);
  }
}
