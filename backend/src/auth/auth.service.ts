import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { LoginDocument, LoginUser } from 'src/login/login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword } from 'src/common/util';

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
    const user = await this.loginModel.findOne({ username }).exec();
    if (!user) {
      return null;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async generateTokens(
    username: string,
    passowrd: string,
    res: Response,
  ): Promise<ResponseDto> {
    const user = await this.findByUsername(username, passowrd);
    if (!user) {
      this.setRefreshToken(res, ''); // 쿠키 삭제

      throw new BadRequestException(
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
    }

    const payload = { username: username, role: user.role };
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

  setRefreshToken(res: Response, refreshToken: string) {
    if (refreshToken) {
      res.cookie(process.env.JWT_REFRESH_SECRET as string, refreshToken, {
        httpOnly: true,
        secure: false, // 로컬/Postman → false
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
      });
    } else {
      res.clearCookie(process.env.JWT_REFRESH_SECRET as string);
    }
  }

  async refreshToken(req: Request): Promise<ResponseDto> {
    const key = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = req.cookies[key] as string;

    if (!refreshToken) {
      throw new BadRequestException(
        new ResponseDto(
          {
            accessToken: '',
            refreshToken: '',
            success: false,
          },
          'no_refresh_token',
          '리프레시 토큰이 없습니다.',
        ),
      );
    }

    const payload: Record<string, any> = this.jwtService.decode(refreshToken);
    const accessToken = await this.jwtService.signAsync({
      username: payload.username as string,
      role: payload.role as string[],
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
