import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  createDate?: string;
}

export class UpdateAuthDto extends AuthDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
