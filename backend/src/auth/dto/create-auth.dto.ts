import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthDto {
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
