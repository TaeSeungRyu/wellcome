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
} from '@nestjs/common';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from './user.service';
import { UpdateUserDto, UserDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/role.decorator';

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
  @Delete('delete')
  async delete(@Body('username') username: string): Promise<ResponseDto> {
    const user = await this.userService.deleteUser(username);
    return user;
  }
}
