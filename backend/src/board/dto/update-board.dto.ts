import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends CreateBoardDto {
  @ApiProperty({
    example: '64f1a9b2c3d4e5f6a7b8c9d0',
    description: '수정할 게시글 ID (Mongo ObjectId)',
  })
  @IsNotEmpty()
  @IsString()
  _id!: string;
}
