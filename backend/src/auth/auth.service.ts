import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { ResponseDto } from '../common/dto/response.dto';
import { comparePassword } from '../common/utils/hash.util';
import { ConstService } from '../const/const.service';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { SseService } from '../sse/sse.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Auth, AuthDocument } from './schemas/auth.schema';
import { LoginUser, LoginUserDocument } from './schemas/login-user.schema';

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7일
const REFRESH_COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24; // 1일
const REFRESH_TOKEN_EXPIRES_IN = '1d';

@Injectable()
export class AuthService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly jwtService: JwtService,
    @InjectModel(LoginUser.name)
    private readonly loginModel: Model<LoginUserDocument>,
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
    private readonly sseService: SseService,
    private readonly constService: ConstService,
  ) {}

  // ==============================
  // 로그인 / 토큰 관리
  // ==============================

  private async findByUsername(
    username: string,
    password: string,
  ): Promise<LoginUser | null> {
    const user = await this.loginModel.findOne({ username }).exec();
    if (!user) return null;
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return null;
    return user;
  }

  async generateTokens(
    loginDto: LoginDto,
    res: Response,
  ): Promise<ResponseDto> {
    const { username, password } = loginDto;
    const user = await this.findByUsername(username, password);
    if (!user) {
      this.setRefreshToken(res, '');
      throw new BadRequestException(
        new ResponseDto(
          {
            accessToken: '',
            refreshToken: '',
            data: { username },
            success: false,
          },
          'invalid_credentials',
          '아이디 또는 비밀번호가 틀립니다.',
        ),
      );
    }

    const payload = { username, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    await this.redis.set(
      `refresh:${user.username}`,
      refreshToken,
      'EX',
      REFRESH_TOKEN_TTL_SECONDS,
    );

    return new ResponseDto(
      {
        accessToken,
        refreshToken,
        data: { username },
        success: true,
      },
      '',
      'Token generation successful',
    );
  }

  setRefreshToken(res: Response, refreshToken: string): void {
    const cookieName = process.env.JWT_REFRESH_SECRET as string;
    if (refreshToken) {
      res.cookie(cookieName, refreshToken, {
        httpOnly: true,
        secure: false, // 로컬/Postman → false
        sameSite: 'lax',
        path: '/',
        maxAge: REFRESH_COOKIE_MAX_AGE_MS,
      });
    } else {
      res.clearCookie(cookieName);
    }
  }

  decodeToken(token: string): string {
    const payload: Record<string, unknown> = this.jwtService.decode(
      token.replace('Bearer ', ''),
    );
    return payload['username'] as string;
  }

  async refreshToken(req: Request): Promise<ResponseDto> {
    const key = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = req.cookies[key] as string;
    const payload: Record<string, unknown> =
      this.jwtService.decode(refreshToken);
    const savedToken = await this.redis.get(`refresh:${payload?.username}`);

    if (!refreshToken || !savedToken || savedToken !== refreshToken) {
      throw new UnauthorizedException(
        new ResponseDto(
          { accessToken: '', refreshToken: '', success: false },
          'no_refresh_token',
          '리프레시 토큰이 없습니다.',
        ),
      );
    }

    const accessToken = await this.jwtService.signAsync({
      username: payload.username as string,
      role: payload.role as string[],
    });

    return new ResponseDto(
      { accessToken, refreshToken, success: true },
      '',
      'Refresh token successful',
    );
  }

  // ==============================
  // 권한 코드 CRUD
  // ==============================

  async findAuthAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    const skip = (page - 1) * limit;
    const [auths, total] = await Promise.all([
      this.authModel.find().skip(skip).limit(limit).exec(),
      this.authModel.countDocuments().exec(),
    ]);
    return new ResponseDto(
      { success: true, data: { auths, total, page, limit } },
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
      { success: true, data: info },
      '',
      '성공적으로 조회했습니다.',
      200,
    );
  }

  private async isExistCode(code: string): Promise<boolean> {
    const existingCode = await this.authModel.findOne({ code }).exec();
    return !!existingCode;
  }

  async createCode(authData: CreateAuthDto): Promise<ResponseDto> {
    if (await this.isExistCode(authData.code)) {
      throw new Error('이미 존재하는 권한 코드입니다.');
    }
    try {
      authData.createDate = new Date().toISOString();
      const savedAuth = await new this.authModel(authData).save();
      return new ResponseDto(
        { success: true, data: savedAuth },
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
      const prevCode = existingCode.code;
      existingCode.code = authData.code;
      existingCode.name = authData.name;
      existingCode.desc = authData.desc;
      const updatedAuth = await existingCode.save();

      await this.updateUserRoles(prevCode, authData.code);

      // 권한 코드 변경은 모든 관리자 콘솔에 즉시 반영되어야 하므로
      // targetUserId 없이 토픽 기반 브로드캐스트.
      this.sseService.publishEvent({
        topic: this.constService.getConstList().SSE_AUTH_CODE_UPDATE,
        data: {
          _id: updatedAuth._id,
          newCode: updatedAuth.code,
          beforeCode: prevCode,
          event: this.constService.getConstList().SSE_AUTH_CODE_UPDATE,
        },
      });

      return new ResponseDto(
        { success: true, data: updatedAuth },
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
      await this.updateUserRoles(existingCode.code);

      this.sseService.publishEvent({
        topic: this.constService.getConstList().SSE_AUTH_CODE_DELETE,
        data: {
          _id: existingCode._id,
          code: existingCode.code,
          event: this.constService.getConstList().SSE_AUTH_CODE_DELETE,
        },
      });

      return new ResponseDto(
        { success: true, data: null },
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

  /**
   * 사용자 컬렉션의 role 배열을 업데이트하거나 삭제한다.
   * @param targetCode 변경/삭제될 대상 권한 코드
   * @param newCode 새 권한 코드 (없으면 제거)
   */
  private async updateUserRoles(
    targetCode: string,
    newCode?: string,
  ): Promise<void> {
    if (newCode) {
      await this.loginModel.updateMany(
        { role: targetCode },
        { $set: { 'role.$': newCode } },
      );
    } else {
      await this.loginModel.updateMany(
        { role: targetCode },
        { $pull: { role: targetCode } },
      );
    }
  }

  async isCodeInUse(code: string): Promise<ResponseDto> {
    const isExist = await this.isExistCode(code);
    return new ResponseDto(
      { success: !isExist, data: { isInUse: isExist } },
      '',
      isExist
        ? '해당 권한 코드를 사용하는 사용자가 있습니다.'
        : '해당 권한 코드를 사용하는 사용자가 없습니다.',
    );
  }
}
