import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '사용자 단건 조회',
    description: 'username으로 특정 사용자 정보를 조회합니다.',
  })
  @ApiQuery({ name: 'username', description: '조회할 사용자 아이디' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Get('find')
  find(@Query('username') username: string): Promise<ResponseDto> {
    return this.userService.findByUsername(username);
  }

  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '페이지네이션으로 전체 사용자 목록을 조회합니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Get('list')
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @ApiOperation({
    summary: '사용자 목록 조회 (JWT 가드 테스트)',
    description: 'JWT AuthGuard 동작 확인용 엔드포인트입니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Get('guard-test-list')
  guardTestList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @ApiOperation({
    summary: '사용자 목록 조회 (Role 가드 테스트)',
    description:
      'Role 기반 접근 제어 테스트용 엔드포인트입니다. (admin / super / manager 권한)',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('admin', 'super', 'manager')
  @Get('role-guard-test-list')
  roleGuardTestList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @ApiOperation({
    summary: '사용자 생성',
    description: '새로운 사용자를 생성합니다. (super / admin 권한)',
  })
  @ApiBody({ type: CreateUserDto, description: '사용자 생성 정보' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Roles('super', 'admin')
  @AuditLog({
    action: 'USER_CREATE',
    target: 'user',
    targetIdBody: 'username',
  })
  @Post('create')
  create(@Body() userData: CreateUserDto): Promise<ResponseDto> {
    return this.userService.createUser(userData);
  }

  @ApiOperation({
    summary: '사용자 생성 (파일 업로드 포함)',
    description:
      'multipart/form-data로 프로필 파일과 함께 사용자를 생성합니다. (super / admin 권한)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto, description: '사용자 생성 정보 및 파일' })
  @ApiResponse({ status: 201, type: ResponseDto })
  @Roles('super', 'admin')
  @AuditLog({
    action: 'USER_CREATE',
    target: 'user',
    targetIdBody: 'username',
  })
  @Post('create-with-file')
  @UseInterceptors(FileInterceptor('file'))
  createWithFile(
    @Body() userData: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return this.userService.createUserWithFile(userData, file);
  }

  @ApiOperation({
    summary: '사용자 존재 여부 확인',
    description:
      '동일한 username의 사용자가 이미 존재하는지 확인합니다. (super / admin 권한)',
  })
  @ApiQuery({ name: 'username', description: '확인할 사용자 아이디' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @Get('check-exist')
  checkExistUser(@Query('username') username: string): Promise<ResponseDto> {
    return this.userService.checkExistUser(username);
  }

  @ApiOperation({
    summary: '사용자 수정',
    description: '기존 사용자 정보를 수정합니다. (super / admin 권한)',
  })
  @ApiBody({ type: UpdateUserDto, description: '사용자 수정 정보' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @AuditLog({
    action: 'USER_UPDATE',
    target: 'user',
    targetIdBody: 'username',
  })
  @Put('update')
  update(@Body() updateData: UpdateUserDto): Promise<ResponseDto> {
    return this.userService.updateUser(updateData);
  }

  @ApiOperation({
    summary: '사용자 수정 (파일 업로드 포함)',
    description:
      'multipart/form-data로 파일과 함께 사용자 정보를 수정합니다. (super / admin 권한)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto, description: '사용자 수정 정보 및 파일' })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @AuditLog({
    action: 'USER_UPDATE',
    target: 'user',
    targetIdBody: 'username',
  })
  @Put('update-with-file')
  @UseInterceptors(FileInterceptor('file'))
  updateWithFile(
    @Body() updateData: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return this.userService.updateUserWithFile(updateData, file);
  }

  @ApiOperation({
    summary: '업로드 파일 다운로드',
    description:
      'uploads 디렉토리에 저장된 파일을 스트림으로 내려받습니다. (super / admin 권한)',
  })
  @ApiParam({ name: 'filename', description: '다운로드할 파일명' })
  @Roles('super', 'admin')
  @Get('uploads/:filename')
  streamFile(@Param('filename') filename: string, @Res() res: Response): void {
    // 🔒 경로 고정 (path traversal 방지)
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('파일이 존재하지 않습니다.');
    }
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    createReadStream(filePath).pipe(res);
  }

  @ApiOperation({
    summary: '사용자 삭제',
    description: 'username으로 사용자를 삭제합니다. (super / admin 권한)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { username: { type: 'string', description: '삭제할 사용자 아이디' } },
    },
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Roles('super', 'admin')
  @AuditLog({
    action: 'USER_DELETE',
    target: 'user',
    targetIdBody: 'username',
  })
  @Delete('delete')
  delete(@Body('username') username: string): Promise<ResponseDto> {
    return this.userService.deleteUser(username);
  }
}
