import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BoardDto {
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

export class UpdateBoardDto extends BoardDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}

export class CommentDto {
  @IsNotEmpty()
  @IsString()
  boardId: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  date: string;
}
