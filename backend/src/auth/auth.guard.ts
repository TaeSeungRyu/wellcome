import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roleFromController = this.reflector.get<string[]>(
      'role',
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest();
    const user = request?.user;
    const savedRole: Array<string> = [];
    if (user?.role && Array.isArray(user.role)) {
      savedRole.push(...(user.role as Array<string>));
    }
    if (!roleFromController || !user || savedRole === undefined) {
      return false;
    }
    const hasRole = () =>
      savedRole.some((role: string) => roleFromController.includes(role));
    if (!hasRole()) {
      return false;
    }
    return true;
  }
}
