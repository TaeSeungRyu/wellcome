// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'testuser', description: '사용자 이름' })
  username: string;

  @ApiProperty({ example: '1234', description: '비밀번호' })
  password: string;
}
