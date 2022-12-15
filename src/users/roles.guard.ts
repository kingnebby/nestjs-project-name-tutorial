import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/auth/public.decorator';
import { Role } from 'src/authz/role.enum';
import { ROLES_KEY } from 'src/authz/roles.decorator';
import { User } from './entities/user.entity';

/**
 * Should allow any route with @Role to be allowed.
 * Should allow if user has at least one required role.
 * Should require user has at least the `User` role
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Duplicated from JwtGuard.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // if end point added roles, check those
    const { user } = context.switchToHttp().getRequest() as { user: User };
    if (requiredRoles) {
      return requiredRoles.some((r) => user.roles?.includes(r));
    }
    // Must at least have a user role.
    if (user?.roles?.includes(Role.User)) {
      return true;
    }
  }
}
