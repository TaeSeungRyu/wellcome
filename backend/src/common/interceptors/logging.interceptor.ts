import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { randomUUID } from 'node:crypto';
import { Observable, tap } from 'rxjs';
import { Logger } from 'winston';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * 모든 HTTP 요청에 대해 다음을 수행:
 *  - `x-request-id` 헤더로 correlation ID 보장 (없으면 생성, 응답 헤더에도 echo)
 *  - 응답 시점에 method/path/status/duration 로깅
 *  - 에러 시 별도 error 로깅 (메시지만 — stack 은 HttpExceptionFilter 가 별도로 기록)
 *
 * AuditInterceptor 는 mutation 만 기록하므로, read 흐름 추적은 이 인터셉터의 역할.
 * SSE 같은 long-lived stream 은 next 콜백이 연결 종료 시점에 호출되므로 시작 로그도 함께 남긴다.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const http = context.switchToHttp();
    const req = http.getRequest<
      Request & { user?: JwtPayload; correlationId?: string }
    >();
    const res = http.getResponse<Response>();

    const incoming = req.headers['x-request-id'];
    const correlationId =
      (typeof incoming === 'string' && incoming) || randomUUID();
    res.setHeader('x-request-id', correlationId);
    req.correlationId = correlationId;

    const start = Date.now();
    const method = req.method;
    const path = req.originalUrl ?? req.url;
    const ip =
      (req.headers['x-forwarded-for'] as string | undefined)
        ?.split(',')[0]
        ?.trim() || req.ip;

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.info(
            `${method} ${path} ${res.statusCode} +${Date.now() - start}ms`,
            {
              correlationId,
              method,
              path,
              status: res.statusCode,
              durationMs: Date.now() - start,
              ip,
              username: req.user?.username,
            },
          );
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(
            `${method} ${path} ERROR +${Date.now() - start}ms — ${message}`,
            {
              correlationId,
              method,
              path,
              durationMs: Date.now() - start,
              ip,
              username: req.user?.username,
              error: message,
            },
          );
        },
      }),
    );
  }
}
