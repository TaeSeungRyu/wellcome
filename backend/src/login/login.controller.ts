// auth.controller.ts
import { Controller, Post, Body, Get, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponseDto } from 'src/common/common.dto';
import { Request, Response } from 'express';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

@ApiTags('Login')
@Controller('auth')
export class LoginController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    type: LoginDto,
    description: '로그인 요청 정보',
  })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    const user: ResponseDto = await this.authService.generateTokens(
      loginDto,
      res,
    );
    this.authService.setRefreshToken(res, user.result?.refreshToken || '');
    return user;
  }

  @ApiOperation({ summary: '리프레시' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Get('refresh')
  async refreshToken(@Req() req: Request): Promise<ResponseDto> {
    return this.authService.refreshToken(req);
  }
}
