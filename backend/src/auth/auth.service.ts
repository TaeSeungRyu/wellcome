import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/common/common.dto';
import { LoginDocument, LoginUser } from 'src/login/login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePassword } from 'src/common/util';
import Redis from 'ioredis';
import { LoginDto } from 'src/login/login.dto';
import { Auth, AuthDocument } from './auth.schema';
import { AuthDto, UpdateAuthDto } from './auth.dto';
import { SseService } from 'src/sse/sse.service';
import { ConstService } from 'src/const/const.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS') private readonly redis: Redis,
    private readonly jwtService: JwtService,
    @InjectModel(LoginUser.name)
    private loginModel: Model<LoginDocument>,

    @InjectModel(Auth.name)
    private authModel: Model<AuthDocument>,

    private sseService: SseService,

    private constService: ConstService,
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
    loginDto: LoginDto,
    res: Response,
  ): Promise<ResponseDto> {
    const { username, password } = loginDto;
    const user = await this.findByUsername(username, password);
    if (!user) {
      this.setRefreshToken(res, ''); // 쿠키 삭제

      throw new BadRequestException(
        new ResponseDto(
          {
            accessToken: '',
            refreshToken: '',
            data: {
              username,
            },
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

    // 🔑 Redis 저장
    await this.redis.set(
      `refresh:${user.username}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    return new Promise((resolve) => {
      resolve(
        new ResponseDto(
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
            data: {
              username,
            },
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
        maxAge: 1000 * 60 * 60 * 24 * 1, // 1일
      });
    } else {
      res.clearCookie(process.env.JWT_REFRESH_SECRET as string);
    }
  }

  decodeToken(token: string): string {
    const payload: Record<string, any> = this.jwtService.decode(
      token.replace('Bearer ', ''),
    );
    return payload['username'] as string;
  }

  async refreshToken(req: Request): Promise<ResponseDto> {
    const key = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = req.cookies[key] as string;
    const payload: Record<string, any> = this.jwtService.decode(refreshToken);
    const savedToken = await this.redis.get(`refresh:${payload.username}`);
    if (!refreshToken || !savedToken || savedToken !== refreshToken) {
      throw new UnauthorizedException(
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

  async findAuthAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    const skip = (page - 1) * limit;
    const auths = await this.authModel.find().skip(skip).limit(limit).exec();
    const total = await this.authModel.countDocuments().exec();
    const paginationData = {
      auths,
      total,
      page,
      limit,
    };
    return new ResponseDto(
      {
        success: true,
        data: paginationData,
      },
      '',
      '성공적으로 조회했습니다.',
      200,
    );
  }
  async findById(id: string): Promise<ResponseDto> {
    const info = await this.authModel.findById(id).exec();

    if (!info) {
      throw new Error('해당 권한 코드를 찾을 수 없습니다.');
    }
    return new ResponseDto(
      {
        success: true,
        data: info,
      },
      '',
      '성공적으로 조회했습니다.',
      200,
    );
  }

  async isExistCode(code: string): Promise<boolean> {
    const existingCode = await this.authModel.findOne({ code }).exec();
    return existingCode ? true : false;
  }

  async createCode(authData: AuthDto): Promise<ResponseDto> {
    const checkCode = await this.isExistCode(authData.code);
    if (checkCode) {
      throw new Error('이미 존재하는 권한 코드입니다.');
    }
    try {
      authData.createDate = new Date().toISOString();
      const newAuth = new this.authModel(authData);
      const savedAuth = await newAuth.save();
      return new ResponseDto(
        {
          success: true,
          data: savedAuth,
        },
        '',
        '권한 코드가 성공적으로 생성되었습니다.',
        201,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '권한 코드 생성 중 오류가 발생했습니다.',
      );
    }
  }

  async updateCode(authData: UpdateAuthDto): Promise<ResponseDto> {
    const existingCode = await this.authModel.findById(authData._id).exec();
    if (!existingCode) {
      throw new Error('해당 권한 코드를 찾을 수 없습니다.');
    }
    try {
      existingCode.code = authData.code;
      existingCode.name = authData.name;
      existingCode.desc = authData.desc;
      const updatedAuth = await existingCode.save();
      this.sseService.publishEvent({
        event: 'event',
        data: {
          _id: updatedAuth._id,
          newCode: updatedAuth.code,
          beforeCode: existingCode.code,
          event: this.constService.getConstList().SSE_AUTH_CODE_UPDATE,
        },
        id: '',
      });

      return new ResponseDto(
        {
          success: true,
          data: updatedAuth,
        },
        '',
        '권한 코드가 성공적으로 업데이트되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '권한 코드 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  async deleteCode(id: string): Promise<ResponseDto> {
    const existingCode = await this.authModel.findById(id).exec();
    if (!existingCode) {
      throw new Error('해당 권한 코드를 찾을 수 없습니다.');
    }
    try {
      await this.authModel.findByIdAndDelete(id).exec();

      this.sseService.publishEvent({
        event: 'event',
        data: {
          _id: existingCode._id,
          code: existingCode.code,
          event: this.constService.getConstList().SSE_AUTH_CODE_DELETE,
        },
        id: '',
      });

      return new ResponseDto(
        {
          success: true,
          data: null,
        },
        '',
        '권한 코드가 성공적으로 삭제되었습니다.',
        200,
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : '권한 코드 삭제 중 오류가 발생했습니다.',
      );
    }
  }
}
