import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

/**
 * 엔드포인트에 JWT 인증 + 역할 검증 가드를 동시에 적용한다.
 *
 * @example
 *   `@Roles('admin', 'super')`
 */
export function Roles(...roles: string[]) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    SetMetadata(ROLES_KEY, roles),
  );
}
