// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({ example: 'testuser', description: '사용자 이름' })
  username: string;

  @IsString()
  @ApiProperty({ example: '1234', description: '비밀번호' })
  password: string;
}
