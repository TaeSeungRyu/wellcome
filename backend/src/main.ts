import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { getValidationPipe, HttpExceptionFilter } from './init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (app) {
    app.use(cookieParser());
    app.useGlobalPipes(getValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());
  }
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
