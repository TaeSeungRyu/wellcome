import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ example: 'ADMIN', description: '권한 코드 (유니크)' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ example: '관리자', description: '권한 표시 이름' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '시스템 최고 권한', description: '권한 설명' })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiPropertyOptional({
    description: '생성일 (서버에서 자동 설정)',
    example: '2025-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  createDate?: string;
}
