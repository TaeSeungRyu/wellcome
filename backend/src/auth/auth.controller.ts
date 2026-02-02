import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from './role.decorator';
import { ResponseDto } from 'src/common/common.dto';
import { AuthDto, UpdateAuthDto } from './auth.dto';

@Controller('auth-code')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Role('admin', 'super')
  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const codeList = await this.authService.findAuthAll(page, limit);
    return codeList;
  }

  @Role('admin', 'super')
  @Post('create')
  async createAuthCode(@Body() authData: AuthDto): Promise<ResponseDto> {
    const newAuthCode = await this.authService.createCode(authData);
    return newAuthCode;
  }

  //@Role('admin', 'super')
  @Put('update')
  async updateAuthCode(@Body() authData: UpdateAuthDto): Promise<ResponseDto> {
    const updatedAuthCode = await this.authService.updateCode(authData);
    return updatedAuthCode;
  }

  @Role('admin', 'super')
  @Delete('delete')
  async deleteAuthCode(@Query('_id') id: string): Promise<ResponseDto> {
    const deletedAuthCode = await this.authService.deleteCode(id);
    return deletedAuthCode;
  }

  @Role('admin', 'super')
  @Get('find')
  async find(@Query('_id') id: string): Promise<ResponseDto> {
    const authCode = await this.authService.findById(id);
    return authCode;
  }
}
