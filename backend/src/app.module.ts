import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { UserModule } from './user/user.modue';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './init';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './init/logger.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './schedule/tasks.module';
import { SseModule } from './sse/sse.module';
import { BoardModule } from './board/board.modue';
import { ConstModule } from './const/const.modue';

@Module({
  imports: [
    WinstonModule.forRoot(winstonOptions),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process?.env?.MONGO_URI as string),
    AuthModule,
    LoginModule,
    UserModule,
    ScheduleModule.forRoot(),
    TasksModule,
    SseModule,
    BoardModule,
    ConstModule,
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
