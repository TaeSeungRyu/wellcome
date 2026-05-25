import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: '공지사항', description: '게시글 제목 (3자 이상)' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    example: '내용을 입력합니다.',
    description: '게시글 본문 (3자 이상)',
  })
  @IsNotEmpty()
  @IsString()
  contents!: string;
}
