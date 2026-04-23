import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { winstonOptions } from './config/logger.config';
import { ConstModule } from './const/const.module';
import { SseModule } from './sse/sse.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process?.env?.MONGO_URI as string),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'default', ttl: 60_000, limit: 120 },
    ]),
    AuthModule,
    UserModule,
    BoardModule,
    SseModule,
    ConstModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
