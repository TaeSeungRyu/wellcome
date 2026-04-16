import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? { ...(exceptionResponse as Record<string, unknown>) }
        : { message: String(exceptionResponse) };

    this.logger.error(
      `HTTP Exception: ${JSON.stringify({
        status,
        ...errorResponse,
      })}`,
    );

    response.status(status).json({
      ...errorResponse,
      status,
      name: exception.name,
    });
  }
}
