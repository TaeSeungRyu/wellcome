import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './role.decorator';
import { ResponseDto } from 'src/common/common.dto';
import { AuthDto } from './auth.dto';

@Controller('auth-code')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Role('admin', 'super', 'manager')
  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const codeList = await this.authService.findAuthAll(page, limit);
    return codeList;
  }

  @Post('create')
  async createAuthCode(@Body() authData: AuthDto): Promise<ResponseDto> {
    const newAuthCode = await this.authService.createCode(authData);
    return newAuthCode;
  }

  @Get('find')
  async find(@Query('id') id: string): Promise<ResponseDto> {
    const authCode = await this.authService.findById(id);
    return authCode;
  }
}
