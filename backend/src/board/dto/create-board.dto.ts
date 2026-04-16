import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  contents?: string;

  @IsOptional()
  @IsString()
  createDate?: string;

  @IsOptional()
  @IsString()
  updateDate?: string;
}
