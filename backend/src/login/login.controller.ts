// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class LoginController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    const user: ResponseDto = await this.authService.generateTokens(
      username,
      password,
      res,
    );
    this.authService.setRefreshToken(res, user.result?.refreshToken || '');
    return user;
  }

  @Get('refresh')
  async refreshToken(@Req() req: Request): Promise<ResponseDto> {
    return this.authService.refreshToken(req);
  }
}
