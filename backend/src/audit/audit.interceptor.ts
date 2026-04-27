import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { AuditService } from './audit.service';
import {
  AUDIT_LOG_KEY,
  AuditLogOptions,
} from './decorators/audit-log.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const options = this.reflector.get<AuditLogOptions | undefined>(
      AUDIT_LOG_KEY,
      context.getHandler(),
    );

    if (!options) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: JwtPayload }>();
    const res = http.getResponse<Response>();
    const startedAt = Date.now();

    const targetId = this.resolveTargetId(req, options);

    return next.handle().pipe(
      tap({
        next: () => this.write(req, res, options, startedAt, targetId, true),
        error: (err: unknown) =>
          this.write(req, res, options, startedAt, targetId, false, err),
      }),
    );
  }

  private resolveTargetId(
    req: Request,
    options: AuditLogOptions,
  ): string | undefined {
    if (options.targetIdParam) {
      const v = (req.params as Record<string, unknown>)?.[options.targetIdParam];
      if (v != null) return String(v);
    }
    if (options.targetIdQuery) {
      const v = (req.query as Record<string, unknown>)?.[options.targetIdQuery];
      if (v != null) return String(v);
    }
    if (options.targetIdBody) {
      const v = (req.body as Record<string, unknown>)?.[options.targetIdBody];
      if (v != null) return String(v);
    }
    return undefined;
  }

  private write(
    req: Request & { user?: JwtPayload },
    res: Response,
    options: AuditLogOptions,
    startedAt: number,
    targetId: string | undefined,
    success: boolean,
    error?: unknown,
  ) {
    const errorMessage =
      !success && error instanceof Error ? error.message : undefined;
    const statusCode =
      !success && error && typeof error === 'object' && 'status' in error
        ? Number((error as { status: unknown }).status) || res.statusCode
        : res.statusCode;

    this.auditService.record({
      username: req.user?.username,
      role: req.user?.role ?? [],
      action: options.action,
      target: options.target,
      targetId,
      method: req.method,
      path: req.originalUrl ?? req.url,
      query: AuditService.sanitize(req.query),
      params: AuditService.sanitize(req.params),
      body: AuditService.sanitize(req.body),
      ip:
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        req.ip,
      userAgent: req.headers['user-agent'],
      statusCode,
      success,
      errorMessage,
      durationMs: Date.now() - startedAt,
    });
  }
}
