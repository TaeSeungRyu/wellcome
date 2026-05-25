import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'alice', description: '로그인 아이디 (3자 이상)' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'P@ssw0rd', description: '비밀번호 (4자 이상)' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '앨리스', description: '표시 이름' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: '마지막 접속일 (서버 측 자동 갱신)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  accessDate?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['ADMIN', 'USER'],
    description: '권한 코드 배열. 단일 문자열도 허용 (자동 배열 변환).',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return [value];
    return [] as string[];
  })
  role?: string[];

  @ApiPropertyOptional({ example: 'alice@example.com', description: '이메일' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '010-1234-5678', description: '전화번호' })
  @IsOptional()
  @IsString()
  phone?: string;
}
