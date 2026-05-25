import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: '사용자 이름' })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({ example: '1234', description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
