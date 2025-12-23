import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ResponseDto } from 'src/common/common.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: string) {
    const payload = { sub: userId };
    //TODO : db조회하고나서 아래

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '1d' }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(req: Request): Promise<ResponseDto> {
    const key = process.env.JWT_REFRESH_SECRET as string;
    const refreshToken = req.cookies[key] as string;

    const payload: Record<string, any> = this.jwtService.decode(refreshToken);
    const accessToken = await this.jwtService.signAsync({
      sub: payload.sub as string,
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
