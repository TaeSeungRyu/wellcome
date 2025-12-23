// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ResponseDto } from 'src/common/common.dto';

@Controller('auth')
export class LoginController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<ResponseDto> {
    const user = await this.authService.generateTokens(username, password);
    return user;
  }
}
