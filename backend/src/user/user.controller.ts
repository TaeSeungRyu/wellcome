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
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { Roles } from '../common/decorators/roles.decorator';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  find(@Query('username') username: string): Promise<ResponseDto> {
    return this.userService.findByUsername(username);
  }

  @Get('list')
  list(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('guard-test-list')
  guardTestList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @Roles('admin', 'super', 'manager')
  @Get('role-guard-test-list')
  roleGuardTestList(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ResponseDto> {
    return this.userService.findAll(page, limit);
  }

  @Roles('super', 'admin')
  @Post('create')
  create(@Body() userData: CreateUserDto): Promise<ResponseDto> {
    return this.userService.createUser(userData);
  }

  @Roles('super', 'admin')
  @Post('create-with-file')
  @UseInterceptors(FileInterceptor('file'))
  createWithFile(
    @Body() userData: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return this.userService.createUserWithFile(userData, file);
  }

  @Roles('super', 'admin')
  @Get('check-exist')
  checkExistUser(@Query('username') username: string): Promise<ResponseDto> {
    return this.userService.checkExistUser(username);
  }

  @Roles('super', 'admin')
  @Put('update')
  update(@Body() updateData: UpdateUserDto): Promise<ResponseDto> {
    return this.userService.updateUser(updateData);
  }

  @Roles('super', 'admin')
  @Put('update-with-file')
  @UseInterceptors(FileInterceptor('file'))
  updateWithFile(
    @Body() updateData: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto> {
    return this.userService.updateUserWithFile(updateData, file);
  }

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

  @Roles('super', 'admin')
  @Delete('delete')
  delete(@Body('username') username: string): Promise<ResponseDto> {
    return this.userService.deleteUser(username);
  }
}
