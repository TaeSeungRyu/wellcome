import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import ms from 'ms';
import { ConstModule } from '../const/const.module';
import { RedisModule } from '../redis/redis.module';
import { SseModule } from '../sse/sse.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './schemas/auth.schema';
import { LoginUser, LoginUserSchema } from './schemas/login-user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn:
            config.get<ms.StringValue>('JWT_ACCESS_EXPIRES_IN') || '86400s',
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: LoginUser.name, schema: LoginUserSchema },
      { name: Auth.name, schema: AuthSchema },
    ]),
    RedisModule,
    SseModule,
    ConstModule,
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
