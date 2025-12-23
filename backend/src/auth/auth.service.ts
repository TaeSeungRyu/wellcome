import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { LoginDocument, LoginUser } from 'src/login/login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(LoginUser.name)
    private loginModel: Model<LoginDocument>,
  ) {}

  async findByUsername(
    username: string,
    password: string,
  ): Promise<LoginUser | null> {
    return this.loginModel.findOne({ username, password }).exec();
  }

  async generateTokens(
    username: string,
    passowrd: string,
  ): Promise<ResponseDto> {
    //TODO : db조회하고나서 아래 페이로드 완성
    console.log('generateTokens', username, passowrd);
    const user = await this.findByUsername(username, passowrd);
    console.log('generateTokens', user);
    if (!user) {
      return new Promise((resolve) => {
        resolve(
          new ResponseDto(
            {
              accessToken: '',
              refreshToken: '',
              success: false,
            },
            'invalid_credentials',
            '아이디 또는 비밀번호가 틀립니다.',
          ),
        );
      });
    }

    const payload = { username: username, roles: ['super', 'admin'] };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
    ]);

    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
          },
          '',
          'Token generation successful',
        ),
      );
    });
  }

  async refreshToken(req: Request): Promise<ResponseDto> {
    const key = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = req.cookies[key] as string;
    const payload: Record<string, any> = this.jwtService.decode(refreshToken);
    const accessToken = await this.jwtService.signAsync({
      username: payload.username as string,
      roles: payload.roles as string[],
    });
    //TODO : db조회하고나서 아래
    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
          },
          '',
          'Refresh token successful',
        ),
      );
    });
  }
}
