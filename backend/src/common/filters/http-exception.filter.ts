import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * 전역 예외 필터.
 *
 * - HttpException: service가 `new ResponseDto(...)` 를 wrapping 해 throw 하는 케이스.
 *   기존 응답 형태({ result, error, message, ... })를 그대로 status code와 함께 내려준다.
 * - 그 외(런타임 에러, Mongoose CastError 등): 500 + `ResponseDto` 형태로 wrap.
 *   prod 환경에서는 내부 에러 메시지를 노출하지 않는다.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const errorResponse =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? { ...(exceptionResponse as Record<string, unknown>) }
          : { message: String(exceptionResponse) };

      this.logger.error(
        `HTTP Exception: ${JSON.stringify({
          status,
          path: request.originalUrl ?? request.url,
          ...errorResponse,
        })}`,
      );

      response.status(status).json({
        ...errorResponse,
        status,
        name: exception.name,
      });
      return;
    }

    // 비-HttpException(런타임 에러 등). 응답 형태를 ResponseDto와 일관시킨다.
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const isProd = process.env.NODE_ENV === 'production';
    const message =
      exception instanceof Error
        ? exception.message
        : '서버에서 오류가 발생했습니다.';
    const errorName = exception instanceof Error ? exception.name : 'Error';
    const stack = exception instanceof Error ? exception.stack : undefined;

    this.logger.error(
      `Unhandled Exception: ${JSON.stringify({
        status,
        path: request.originalUrl ?? request.url,
        name: errorName,
        message,
        stack,
      })}`,
    );

    response.status(status).json({
      result: { success: false },
      error: 'internal_server_error',
      message: isProd ? '서버에서 오류가 발생했습니다.' : message,
      status,
      name: errorName,
    });
  }
}
