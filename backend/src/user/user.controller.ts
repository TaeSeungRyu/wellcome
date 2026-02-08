// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Delete,
  Put,
  Get,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Res,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from './user.service';
import { UpdateUserDto, UserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { join } from 'path';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('find')
  async find(@Query('username') username: string): Promise<ResponseDto> {
    const user = await this.userService.findByUsername(username);
    return user;
  }

  @Get('list')
  async list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const users = await this.userService.findAll(page, limit);
    return users;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('guard-test-list')
  async guardTestlist(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const users = await this.userService.findAll(page, limit);
    return users;
  }

  @Role('admin', 'super', 'manager')
  @Get('role-guard-test-list')
  async roleGuardTestlist(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    const users = await this.userService.findAll(page, limit);
    return users;
  }

  @Role('super', 'admin')
  @Post('create')
  async create(@Body() userData: UserDto): Promise<ResponseDto> {
    const user = await this.userService.createUser(userData);
    return user;
  }

  //테스트 컨트롤러, 테스트 완료 후 create 로 통합 예정
  @Role('super', 'admin')
  @Post('create-with-file')
  @UseInterceptors(FileInterceptor('file')) // 'file'은 클라이언트가 보내는 field name
  async createWithFile(
    @Body() userData: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    const user = await this.userService.createUserWithFile(userData, file);
    return user;
  }

  @Role('super', 'admin')
  @Get('check-exist')
  async checkExistUser(
    @Query('username') username: string,
  ): Promise<ResponseDto> {
    const user = await this.userService.checkExistUser(username);
    return user;
  }

  @Role('super', 'admin')
  @Put('update')
  async update(@Body() updateData: UpdateUserDto): Promise<ResponseDto> {
    const user = await this.userService.updateUser(updateData);
    return user;
  }

  @Role('super', 'admin')
  @Put('update-with-file')
  @UseInterceptors(FileInterceptor('file')) // 'file'은 클라이언트가 보내는 field name
  async updateWithFile(
    @Body() updateData: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    const user = await this.userService.updateUserWithFile(updateData, file);
    return user;
  }

  @Role('super', 'admin')
  @Get(':filename')
  streamFile(@Param('filename') filename: string, @Res() res: Response) {
    // 🔒 경로 고정 (path traversal 방지)
    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('파일이 존재하지 않습니다.');
    }
    const contentType = 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    // 다운로드 강제
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(filename)}"`,
    );
    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Role('super', 'admin')
  @Delete('delete')
  async delete(@Body('username') username: string): Promise<ResponseDto> {
    const user = await this.userService.deleteUser(username);
    return user;
  }
}
