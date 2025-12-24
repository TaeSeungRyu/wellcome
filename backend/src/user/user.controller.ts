// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ResponseDto } from 'src/common/common.dto';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('find')
  async find(@Body('username') username: string): Promise<ResponseDto> {
    const user = await this.userService.findByUsername(username);
    return user;
  }

  @Post('create')
  async create(@Body() userData: UserDto): Promise<ResponseDto> {
    const user = await this.userService.createUser(userData);
    return user;
  }

  @Post('update')
  async update(@Body() updateData: UserDto): Promise<ResponseDto> {
    const user = await this.userService.updateUser(updateData);
    return user;
  }
}
