import { AuditService } from './audit.service';

describe('AuditService.sanitize', () => {
  it('민감 키를 [REDACTED] 로 치환한다', () => {
    const out = AuditService.sanitize({
      username: 'alice',
      password: 'secret',
      accessToken: 'jwt.token.value',
      refreshToken: 'r-token',
      token: 't',
      authorization: 'Bearer x',
    });

    expect(out).toEqual({
      username: 'alice',
      password: '[REDACTED]',
      accessToken: '[REDACTED]',
      refreshToken: '[REDACTED]',
      token: '[REDACTED]',
      authorization: '[REDACTED]',
    });
  });

  it('민감하지 않은 키는 그대로 보존한다', () => {
    const out = AuditService.sanitize({
      username: 'alice',
      role: ['admin'],
      page: 1,
    });

    expect(out).toEqual({
      username: 'alice',
      role: ['admin'],
      page: 1,
    });
  });

  it('2000자 초과 문자열은 truncate 한다', () => {
    const long = 'a'.repeat(2500);
    const out = AuditService.sanitize({ payload: long });

    expect(typeof out?.payload).toBe('string');
    expect((out!.payload as string).length).toBe(
      2000 + '...[truncated]'.length,
    );
    expect((out!.payload as string).endsWith('...[truncated]')).toBe(true);
  });

  it('2000자 이하 문자열은 그대로 둔다', () => {
    const value = 'short value';
    expect(AuditService.sanitize({ value })).toEqual({ value });
  });

  it('null/undefined/원시값은 undefined 반환', () => {
    expect(AuditService.sanitize(null)).toBeUndefined();
    expect(AuditService.sanitize(undefined)).toBeUndefined();
    expect(AuditService.sanitize('string')).toBeUndefined();
    expect(AuditService.sanitize(123)).toBeUndefined();
  });

  it('빈 객체는 빈 객체로 반환', () => {
    expect(AuditService.sanitize({})).toEqual({});
  });
});
