import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// PartialType은 부모(CreateUserDto)의 모든 ApiProperty를 자동 상속하면서
// required: false 로 변환한다. 여기서는 update 전용 필드 두 개만 명시.
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'NewP@ssw0rd',
    description: '비밀번호 (변경 시에만 전달, 빈 문자열은 미변경 의미)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    example: '/uploads/abc123.png',
    description: '프로필 이미지 경로. 빈 문자열이면 기존 이미지 삭제',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
