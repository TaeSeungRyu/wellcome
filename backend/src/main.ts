import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { getValidationPipe } from './common/pipes/validation.pipe';
import { winstonOptions } from './config/logger.config';

async function bootstrap() {
  const isSchedulerOnly = process.env.SCHEDULER_ONLY === 'true';

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  app.useGlobalPipes(getValidationPipe());
  app.useLogger(WinstonModule.createLogger(winstonOptions));

  if (!isSchedulerOnly) {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API 문서')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT ?? 8080);
  } else {
    await NestFactory.createApplicationContext(AppModule);
  }
}

bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1);
});
