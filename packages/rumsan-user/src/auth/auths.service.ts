import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { createId } from '@paralleldrive/cuid2';
import { ERRORS } from '@rumsan/extensions/exceptions';
import { PrismaClient } from '@rumsan/prisma/client';
import {
  AuthService,
  AuthSession,
  CurrentUser,
  TokenData,
  tRC,
  User,
} from '@rumsan/sdk/types';
import axios from 'axios';
import { hashMessage, recoverAddress } from 'viem';
import { CLIENT_TOKEN_LIFETIME, EVENTS } from '../constants';
import { createChallenge, decryptChallenge } from '../utils/challenge.utils';
import { getSecret } from '../utils/config.utils';
import { getServiceTypeByAddress } from '../utils/service.utils';
import {
  ChallengeDto,
  GoogleAuthDto,
  OtpDto,
  OtpLoginDto,
  WalletLoginDto,
} from './dtos';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);
  constructor(
    protected prisma: PrismaClient,
    private jwt: JwtService,
    private config: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  getUserByCuid(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        cuid: userId,
        deletedAt: null,
      },
    }) as Promise<User>;
  }

  async getOtp(dto: OtpDto, requestInfo: tRC) {
    if (!dto.service) {
      dto.service = getServiceTypeByAddress(dto.address) as AuthService;
    }
    const auth = await this.prisma.auth.findUnique({
      where: {
        AuthServiceIdentifier: {
          service: dto.service as AuthService,
          serviceId: dto.address,
        },
      },
    });
    if (!auth) throw new ForbiddenException(`Invalid ${dto.service}!`);
    const otp = Math.floor(100000 + Math.random() * 900000);
    await this.prisma.auth.update({
      where: {
        id: auth.id,
      },
      data: {
        challenge: otp.toString(),
      },
    });
    const user = await this.getUserByCuid(auth.userId);
    if (!user) throw new ForbiddenException('User does not exist!');
    const challenge = createChallenge(getSecret(), {
      address: dto.address,
      clientId: dto.clientId,
      ip: requestInfo.ip,
    });
    this.eventEmitter.emit(EVENTS.OTP_CREATED, {
      ...dto,
      requestInfo,
      otp,
    });
    this.eventEmitter.emit(EVENTS.CHALLENGE_CREATED, {
      ...dto,
      requestInfo,
      challenge,
    });
    this.logger.log('OTP created: ' + otp);

    return challenge;
  }

  async loginByOtp(dto: OtpLoginDto, requestInfo: tRC) {
    const { challenge, otp } = dto;
    const challengeData = decryptChallenge(
      getSecret(),
      challenge,
      CLIENT_TOKEN_LIFETIME,
    );
    if (!challengeData.address)
      throw new ForbiddenException('Invalid credentials in challenge!');
    if (!dto.service) {
      dto.service = getServiceTypeByAddress(
        challengeData.address,
      ) as AuthService;
    }

    const auth = await this.getByServiceId(
      challengeData.address,
      dto.service as AuthService,
    );

    if (!auth) throw new ForbiddenException('Invalid credentials!');
    if (otp.toString() !== auth.challenge)
      throw new ForbiddenException('OTP did not match!');
    // Get user by authAddress
    const user = (await this.getUserByCuid(auth.userId)) as User;
    if (!user) throw new ForbiddenException('User does not exist!');
    const authority = await this.getPermissionsByUserId(auth.userId);
    await this.updateLastLogin(auth.id);

    // Add authLog
    const session = (await this.prisma.authSession
      .create({
        data: {
          clientId: challengeData.clientId,
          authId: auth.id,
          ip: requestInfo.ip,
          userAgent: requestInfo.userAgent,
        },
      })
      .then()) as AuthSession;
    return this.signToken(user, authority, session);
  }

  getChallengeForWallet(dto: ChallengeDto, requestInfo: tRC) {
    return createChallenge(getSecret(), {
      clientId: dto.clientId,
      ip: requestInfo.ip,
    });
  }

  async loginByGoogle(dto: GoogleAuthDto, requestInfo: tRC) {
    //validate google idToken

    let gUser,
      walletAddress: `0x${string}` | null = null;
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${dto.idToken}`,
      );
      gUser = data;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google Token');
    }

    if (dto.walletSignature)
      walletAddress = await this.getWalletAddressFromSignature(
        dto.walletSignature,
        dto.idToken,
      );

    let user = (await this.prisma.userDetails.findFirst({
      where: {
        email: gUser?.email as string,
      },
    })) as User;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user = (await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet: walletAddress,
      },
    })) as User;

    const auth = await this.prisma.auth.upsert({
      where: {
        AuthServiceIdentifier: {
          service: AuthService.WALLET,
          serviceId: walletAddress as string,
        },
      },
      create: {
        userId: user.cuid,
        service: AuthService.WALLET,
        serviceId: walletAddress as string,
      },
      update: {},
    });

    const authority = await this.getPermissionsByUserId(auth.userId);
    await this.updateLastLogin(auth.id);
    // Add authLog
    const session = (await this.prisma.authSession
      .create({
        data: {
          clientId: createId(),
          authId: auth.id,
          ip: requestInfo.ip,
          userAgent: requestInfo.userAgent,
        },
      })
      .then()) as AuthSession;
    return this.signToken(user, authority, session);
  }

  async getWalletAddressFromSignature(
    signature: `0x${string}`,
    message: string,
  ) {
    try {
      const hash = hashMessage(message);
      return recoverAddress({
        hash,
        signature,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid Wallet Signature');
    }
  }

  async loginByWallet(dto: WalletLoginDto, requestInfo: tRC) {
    const challengeData = decryptChallenge(
      getSecret(),
      dto.challenge,
      CLIENT_TOKEN_LIFETIME,
    );
    if (requestInfo.ip !== challengeData.ip) throw ERRORS.NO_MATCH_IP;

    const hash = hashMessage(dto.challenge);
    const walletAddress = await recoverAddress({
      hash,
      signature: dto.signature,
    });

    const auth = await this.getByServiceId(walletAddress, AuthService.WALLET);
    if (!auth) throw new ForbiddenException('Invalid credentials!');
    const user = await this.getUserByCuid(auth.userId);
    if (!user) throw new ForbiddenException('User does not exist!');
    const authority = await this.getPermissionsByUserId(auth.userId);
    await this.updateLastLogin(auth.id);

    // Add authLog
    const session = (await this.prisma.authSession.create({
      data: {
        clientId: challengeData.clientId,
        authId: auth.id,
        ip: requestInfo.ip,
        userAgent: requestInfo.userAgent,
      },
    })) as AuthSession;

    return this.signToken(user, authority, session);
  }

  async getRolesByUserId(userId: string) {
    const user = await this.getUserByCuid(userId);
    if (!user) throw new ForbiddenException('User does not exist!');
    const roles = await this.prisma.userRole.findMany({
      where: {
        userId, //TODO get rid of expired roles (from userRoles and roles tables)
      },

      select: {
        roleId: true,
        Role: {
          select: {
            name: true,
          },
        },
      },
    });
    return roles.map(({ roleId, Role }) => ({
      roleId,
      roleName: Role?.name,
    }));
  }

  async getPermissionsByUserId(userId: string) {
    const roles = await this.getRolesByUserId(userId);
    const rolesIdArray = roles.map((role) => role.roleId);
    const permissions = await this.prisma.permission.findMany({
      where: {
        roleId: {
          in: rolesIdArray,
        },
      },
      select: {
        action: true,
        subject: true,
        inverted: true,
        conditions: true,
      },
    });
    return { roles, permissions };
  }

  getByServiceId(serviceId: string, service: AuthService) {
    return this.prisma.auth.findUnique({
      where: {
        AuthServiceIdentifier: {
          serviceId,
          service,
        },
      },
    });
  }

  updateLastLogin(id: number) {
    return this.prisma.auth.update({
      where: {
        id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }

  create(userId: string, serviceId: string, service: AuthService) {
    return this.prisma.auth.create({
      data: {
        userId,
        service,
        serviceId,
      },
    });
  }

  createEmail(userId: string, email: string) {
    return this.create(userId, email, AuthService.EMAIL);
  }

  createPhone(userId: string, phone: string) {
    return this.create(userId, phone, AuthService.PHONE);
  }

  createWallet(userId: string, wallet: string) {
    return this.create(userId, wallet, AuthService.WALLET);
  }

  async signToken(
    user: User,
    authority: any,
    session: AuthSession,
  ): Promise<{ currentUser: CurrentUser; accessToken: string }> {
    const { sessionId } = session;
    const { id, cuid } = user;
    const currentUser: TokenData = {
      id: id,
      cuid,
      roles: authority.roles.map((role: any) => role.roleName),
      permissions: authority.permissions,
      sessionId,
    };

    const expiryTime = this.config.get('JWT_EXPIRATION_TIME');

    const token = await this.jwt.signAsync(currentUser, {
      expiresIn: expiryTime,
      secret: getSecret(),
    });

    return {
      currentUser,
      accessToken: token,
    };
  }

  validateToken(token: string) {
    return this.jwt.verify(token, {
      secret: getSecret(),
    });
  }
}
