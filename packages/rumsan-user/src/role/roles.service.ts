import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@rumsan/prisma/client';
import { Permission, PermissionSet, Role } from '@rumsan/sdk/types';
import { paginator, PaginatorTypes, StringUtils } from '@rumsan/sdk/utils';
import { ERRORS } from '../constants';
import { RSE } from '../constants/errors';
import {
  checkPermissionSet,
  convertToPermissionSet,
} from '../utils/permission.utils';
import { CreateRoleDto, EditRoleDto, ListRoleDto } from './dtos';

const paginate: PaginatorTypes.PaginateFunction = paginator({ perPage: 20 });
// type PrismaClientType = Omit<
//   PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
//   '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
// >;

@Injectable()
export class RolesService {
  constructor(protected prisma: PrismaClient) {}

  async create(dto: CreateRoleDto) {
    if (!StringUtils.isValidString(dto.name)) throw ERRORS.ROLE_NAME_INVALID;
    const { permissions, ...data } = dto;
    const { isValid, validSubjects } = checkPermissionSet(permissions);
    if (!isValid)
      throw RSE(
        `Invalid permission set. Valid subjects are {{validSubjects}}.`,
        'PERMISSION_SET_INVALID',
        400,
        { validSubjects: validSubjects.join(', ') },
      );

    return this.prisma.$transaction(async (prisma: PrismaClient) => {
      const role = await prisma.role.create({ data });
      await this._addPermissionsToRole(role.cuid, permissions, prisma);

      return role;
    });
  }

  async update(roleName: string, dto: EditRoleDto) {
    return this.prisma.$transaction(async (prisma: PrismaClient) => {
      const { role: existingRole } = await this.getRoleByName(roleName);
      const { permissions, ...data } = dto;

      // Update the role details
      const updatedRole = await prisma.role.update({
        where: { cuid: existingRole.cuid },
        data,
      });

      // If permissions are provided, update them
      if (permissions) {
        // Delete existing permissions
        await prisma.permission.deleteMany({
          where: { roleId: existingRole.cuid },
        });

        await this._addPermissionsToRole(
          existingRole.cuid,
          permissions,
          prisma,
        );
      }

      return {
        role: updatedRole,
        permissions: await this._getPermissionsByRoleId(
          updatedRole.cuid,
          prisma,
        ),
      };
    });
  }

  async delete(name: string) {
    return this.prisma.$transaction(async (prisma) => {
      const { role } = await this.getRoleByName(name);
      if (role.isSystem)
        throw RSE('System roles cannot be deleted.', 'ROLE_SYS_NODELETE', 401);

      // Delete existing permissions
      await prisma.permission.deleteMany({
        where: { roleId: role.cuid },
      });

      return prisma.role.delete({
        where: { cuid: role.cuid, isSystem: false },
      });
    });
  }

  async list(dto: ListRoleDto): Promise<PaginatorTypes.PaginatedResult<Role>> {
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[dto.sort] = dto.order;

    return paginate(
      this.prisma.role,
      {
        orderBy,
      },
      {
        page: dto.page,
        perPage: dto.limit,
      },
    );
  }

  async getById(roleId: string) {
    return this.prisma.role.findUnique({ where: { cuid: roleId } });
  }

  async getRoleByName(name: string, includePermissions = false) {
    const role = await this.prisma.role.findUnique({ where: { name } });
    if (!role) throw RSE('Roles does not exist!', 'ROLE_NOEXIST', 404);
    if (includePermissions) {
      const permissions = await this._getPermissionsByRoleId(role.cuid);
      return { role, permissions };
    }
    return { role, permissions: null };
  }

  async getRoleById(roleId: string, includePermissions = false) {
    const role = await this.prisma.role.findUnique({ where: { cuid: roleId } });
    if (!role) throw RSE('Roles does not exist!', 'ROLE_NOEXIST', 404);
    if (includePermissions) {
      const permissions = await this._getPermissionsByRoleId(role.cuid);
      return { role, permissions };
    }
    return { role, permissions: null };
  }

  async getRolesByPermission(action: string, subject: string): Promise<Role[]> {
    const rolesWithPermission = await this.prisma.permission.findMany({
      where: {
        action,
        subject,
      },
      select: {
        roleId: true,
      },
    });

    const roleIds = rolesWithPermission.map((permission) => permission.roleId);

    const roles = await this.prisma.role.findMany({
      where: {
        cuid: {
          in: roleIds,
        },
      },
    });

    return roles as unknown as Role[];
  }

  async listPermissionsByRole(name: string) {
    const { role } = await this.getRoleByName(name);
    return this.prisma.permission.findMany({
      where: {
        roleId: role.cuid,
      },
    });
  }

  async _getPermissionsByRoleId(roleId: string, prisma = this.prisma) {
    const permissions = (await prisma.permission.findMany({
      where: {
        roleId,
      },
    })) as Permission[];

    return convertToPermissionSet(permissions);
  }

  _addPermissionsToRole(
    roleId: string,
    permissions: PermissionSet,
    prisma = this.prisma,
  ) {
    const permissionsData: any = [];
    for (const subject in permissions) {
      for (const action of permissions[subject]) {
        permissionsData.push({
          roleId,
          subject,
          action,
        });
      }
    }
    return prisma.permission.createMany({
      data: permissionsData,
    });
  }

  _addPermissionToRole(
    permission: Pick<Permission, 'roleId' | 'action' | 'subject'>,
    prisma = this.prisma,
  ) {
    return prisma.permission.create({
      data: permission,
    });
  }
}
