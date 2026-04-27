import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==============================
  // 로그인 / 토큰 재발급
  // ==============================

  @ApiOperation({
    summary: '로그인',
    description:
      '아이디와 비밀번호로 로그인하고 Access / Refresh Token을 발급합니다.',
  })
  @ApiBody({ type: LoginDto, description: '로그인 요청 정보' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @AuditLog({ action: 'AUTH_LOGIN', target: 'auth', targetIdBody: 'username' })
  @Post('auth/login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    const result = await this.authService.generateTokens(loginDto, res);
    this.authService.setRefreshToken(res, result.result?.refreshToken ?? '');
    return result;
  }

  @ApiOperation({
    summary: '리프레시',
    description:
      '저장된 쿠키의 Refresh Token으로 Access / Refresh Token을 재발급합니다.',
  })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Get('auth/refresh')
  refreshToken(@Req() req: Request): Promise<ResponseDto> {
    return this.authService.refreshToken(req);
  }

  @ApiOperation({
    summary: '로그아웃',
    description:
      'Refresh Token 쿠키를 제거하고 Redis 에 저장된 토큰을 무효화합니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @AuditLog({ action: 'AUTH_LOGOUT', target: 'auth' })
  @Post('auth/logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto> {
    return this.authService.logout(req, res);
  }

  // ==============================
  // 권한 코드 CRUD
  // ==============================

  @ApiOperation({
    summary: '권한 코드 목록 조회',
    description: '페이지네이션으로 권한 코드 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super')
  @Get('auth-code/list')
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.authService.findAuthAll(page, limit);
  }

  @ApiOperation({
    summary: '권한 코드 생성',
    description: '새로운 권한 코드를 생성합니다.',
  })
  @ApiBody({ type: CreateAuthDto, description: '권한 코드 생성 정보' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Roles('admin', 'super')
  @AuditLog({
    action: 'AUTH_CODE_CREATE',
    target: 'auth_code',
    targetIdBody: 'code',
  })
  @Post('auth-code/create')
  createAuthCode(@Body() authData: CreateAuthDto): Promise<ResponseDto> {
    return this.authService.createCode(authData);
  }

  @ApiOperation({
    summary: '권한 코드 수정',
    description: '기존 권한 코드 정보를 수정합니다.',
  })
  @ApiBody({ type: UpdateAuthDto, description: '권한 코드 수정 정보' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super')
  @AuditLog({
    action: 'AUTH_CODE_UPDATE',
    target: 'auth_code',
    targetIdBody: '_id',
  })
  @Put('auth-code/update')
  updateAuthCode(@Body() authData: UpdateAuthDto): Promise<ResponseDto> {
    return this.authService.updateCode(authData);
  }

  @ApiOperation({
    summary: '권한 코드 삭제',
    description: '_id로 지정한 권한 코드를 삭제합니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super')
  @AuditLog({
    action: 'AUTH_CODE_DELETE',
    target: 'auth_code',
    targetIdQuery: '_id',
  })
  @Delete('auth-code/delete')
  deleteAuthCode(@Query('_id') id: string): Promise<ResponseDto> {
    return this.authService.deleteCode(id);
  }

  @ApiOperation({
    summary: '권한 코드 단건 조회',
    description: '_id로 지정한 권한 코드를 조회합니다. (admin / super 권한)',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super')
  @Get('auth-code/find')
  find(@Query('_id') id: string): Promise<ResponseDto> {
    return this.authService.findById(id);
  }

  @ApiOperation({
    summary: '권한 코드 사용 여부 확인',
    description:
      '해당 권한 코드가 사용자에게 매핑되어 사용 중인지 확인합니다. (admin / super 권한)',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super')
  @Get('auth-code/check-code')
  checkCode(@Query('code') code: string): Promise<ResponseDto> {
    return this.authService.isCodeInUse(code);
  }
}
