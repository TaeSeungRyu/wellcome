import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BoardDto {
  @IsString()
  _id: string;

  @IsNotEmpty()
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

export class CommentDto {
  @IsString()
  _id: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsString()
  date: string;
}
