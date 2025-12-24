import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (app) {
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
  }
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
