import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { PrismaClientKnownRequestError } from '@rumsan/prisma/client/runtime/library';
import {
  AuthService,
  Signup,
  SignupConfig,
  SignupStatus,
} from '@rumsan/sdk/types';
import { paginator, PaginatorTypes } from '@rumsan/sdk/utils';
import { CreateUserDto } from '../user/dtos';
import { UsersService } from '../user/users.service';
import {
  SignupApproveDto,
  SignupEmailDto,
  SignupListDto,
  SignupPhoneDto,
  SignupWalletDto,
} from './dtos';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
// type PrismaClientType = Omit<
//   PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//   '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
// >;
@Injectable()
export class SignupsService {
  constructor(
    @Inject('SIGNUP_CONFIG') private config: SignupConfig,
    protected prisma: PrismaClient,
    private userService: UsersService,
  ) {}

  async signup(dto: SignupEmailDto | SignupPhoneDto | SignupWalletDto) {
    let authIdentifier: { service: AuthService; serviceId: string };
    if (dto instanceof SignupPhoneDto)
      authIdentifier = { service: AuthService.PHONE, serviceId: dto.phone };
    else if (dto instanceof SignupWalletDto)
      authIdentifier = { service: AuthService.WALLET, serviceId: dto.wallet };
    else authIdentifier = { service: AuthService.EMAIL, serviceId: dto.email };

    if (await this.prisma.auth.findFirst({ where: authIdentifier }))
      throw new Error('Already registered');

    const rec = (await this.prisma['signup'].create({
      data: {
        userIdentifier: authIdentifier.serviceId,
        data: {
          ...dto,
        },
      },
    })) as Signup;

    if (this.config.autoApprove) {
      await this.approve({ cuid: rec.cuid });
    }
    return rec;
  }

  async list(
    dto: SignupListDto,
  ): Promise<PaginatorTypes.PaginatedResult<Signup>> {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[dto.sort] = dto.order;
    return paginate(
      this.prisma['signup'],
      {
        where: {
          status: dto.status,
        },
        orderBy,
      },
      {
        page: dto.page,
        perPage: dto.limit,
      },
    );
  }

  async approve(dto: SignupApproveDto) {
    const signup = await this.prisma['signup'].findUnique({
      where: {
        cuid: dto.cuid,
      },
    });
    if (!signup) throw new Error('Signup not found');
    if (
      signup.status === SignupStatus.APPROVED ||
      signup.status === SignupStatus.REJECTED
    )
      throw new Error('Signup is already processed.');

    try {
      const userData: CreateUserDto = <CreateUserDto>(signup.data as unknown);

      const callback = async (err: any, tx: any) => {
        if (err) throw err;
        await tx.signup.update({
          where: {
            cuid: dto.cuid,
          },
          data: {
            status: SignupStatus.APPROVED,
            rejectedReason: null,
            approvedAt: new Date(),
          },
        });
      };

      const result = await this.userService.create(userData, callback);
      return result;
    } catch (err) {
      let rejectedReason = 'Unknown';
      if (err instanceof Error) rejectedReason = err.message;
      if (err instanceof PrismaClientKnownRequestError) {
        rejectedReason = err.message;
      }

      return this.prisma['signup'].update({
        where: {
          cuid: dto.cuid,
        },
        data: {
          status: SignupStatus.FAILED,
          rejectedReason,
        },
      });
    }
  }
}
