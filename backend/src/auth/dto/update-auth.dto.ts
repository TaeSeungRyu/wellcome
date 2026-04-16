import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
