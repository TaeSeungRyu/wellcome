import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './auth.guard';

export function Role(...arg: any) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RoleGuard),
    SetMetadata('role', arg),
  );
}
