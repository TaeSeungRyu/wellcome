import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './role.decorator';
import { ResponseDto } from 'src/common/common.dto';

@Controller('auth-code')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Role('admin', 'super', 'manager')
  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const codeList = await this.authService.findAuthAll(page, limit);
    return codeList;
  }
}
