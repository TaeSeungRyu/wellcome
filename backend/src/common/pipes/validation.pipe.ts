import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseDto } from '../dto/response.dto';

export function getValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors
        .map((error) => Object.values(error.constraints ?? {}))
        .flat();
      return new BadRequestException(
        new ResponseDto(
          { success: false },
          'validation_error',
          messages.join(', '),
        ),
      );
    },
  });
}
