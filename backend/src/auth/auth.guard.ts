import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const rolesFromController = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest();
    const user = request?.user;
    const savedRoles: Array<string> = [];
    if (user?.roles && Array.isArray(user.roles)) {
      savedRoles.push(...(user.roles as Array<string>));
    }

    if (!rolesFromController || !user || savedRoles === undefined) {
      return false;
    }
    const hasRole = () =>
      savedRoles.some((role: string) => rolesFromController.includes(role));
    if (!hasRole()) {
      return false;
    }
    return true;
  }
}
