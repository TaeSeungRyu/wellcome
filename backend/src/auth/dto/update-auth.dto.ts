import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends CreateAuthDto {
  @ApiProperty({
    example: '64f1a9b2c3d4e5f6a7b8c9d0',
    description: '권한 코드 문서 ID (Mongo ObjectId)',
  })
  @IsNotEmpty()
  @IsString()
  _id: string;
}
