import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import ms from 'ms';
import { AuthService } from './auth.service';
import { LoginSchema, LoginUser } from 'src/login/login.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    MongooseModule.forFeature([{ name: LoginUser.name, schema: LoginSchema }]),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {
  constructor() {
    // console.log(
    //   process.env.JWT_ACCESS_SECRET,
    //   process.env.JWT_ACCESS_EXPIRES_IN,
    // );
  }
}
