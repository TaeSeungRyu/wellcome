import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
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
  ],
})
export class AppModule {}
