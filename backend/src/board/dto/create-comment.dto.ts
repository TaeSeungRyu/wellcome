import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: '64f1a9b2c3d4e5f6a7b8c9d0',
    description: '대상 게시글 ID',
  })
  @IsNotEmpty()
  @IsString()
  boardId!: string;

  @ApiProperty({ example: '좋은 글이네요.', description: '댓글 내용' })
  @IsNotEmpty()
  @IsString()
  comment!: string;
}
