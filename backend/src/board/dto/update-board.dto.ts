import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends CreateBoardDto {
  @IsNotEmpty()
  @IsString()
  _id!: string;
}
