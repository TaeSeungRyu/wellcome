import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  boardId!: string;

  @IsNotEmpty()
  @IsString()
  comment!: string;
}
