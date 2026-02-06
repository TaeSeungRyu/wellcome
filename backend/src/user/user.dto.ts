import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  accessDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true }) // 각 요소가 문자열인지 확인
  @Transform(({ value }) => {
    // 1. 이미 배열인 경우 (NestJS 파서가 이미 배열로 만든 경우)
    if (Array.isArray(value)) return value as string[];
    // 2. 'admin' 처럼 단일 문자열로 들어온 경우 배열로 감싸줌
    if (typeof value === 'string') return [value];
    return [] as string[];
  })
  role?: string[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto extends PartialType(UserDto) {
  @IsOptional()
  @IsString()
  password?: string;
}
