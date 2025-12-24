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
  role?: string[];

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
