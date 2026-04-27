import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log_options';

export interface AuditLogOptions {
  action: string;
  target: string;
  targetIdParam?: string;
  targetIdQuery?: string;
  targetIdBody?: string;
}

/**
 * 핸들러 실행을 audit_log 컬렉션에 기록한다.
 *
 * @example
 *   `@AuditLog({ action: 'USER_CREATE', target: 'user', targetIdBody: 'username' })`
 */
export const AuditLog = (options: AuditLogOptions) =>
  SetMetadata(AUDIT_LOG_KEY, options);
