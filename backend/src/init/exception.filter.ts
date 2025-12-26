// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    // response 키를 제거하고 내용만 펼쳐서 반환
    const errorResponse =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? { ...(exceptionResponse as Record<string, unknown>) }
        : { message: String(exceptionResponse) };

    response.status(status).json({
      ...errorResponse, // ResponseDto의 내용이 여기 펼쳐짐
      status,
      name: exception.name,
    });
  }
}
