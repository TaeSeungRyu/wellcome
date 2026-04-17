import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../common/dto/response.dto';
import { ConstService } from './const.service';

@ApiTags('Const')
@Controller('const')
export class ConstController {
  constructor(private readonly service: ConstService) {}

  @ApiOperation({
    summary: '상수 목록 조회',
    description:
      '시스템에서 사용하는 공통 상수 목록(드롭다운/코드 매핑 등)을 반환합니다.',
  })
  @ApiResponse({ status: 200, type: ResponseDto })
  @Get('list')
  list(): ResponseDto {
    return new ResponseDto({
      success: true,
      data: this.service.getConstList(),
    });
  }
}
