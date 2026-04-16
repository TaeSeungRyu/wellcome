import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from '../common/dto/response.dto';
import { ConstService } from './const.service';

@Controller('const')
export class ConstController {
  constructor(private readonly service: ConstService) {}

  @Get('list')
  list(): ResponseDto {
    return new ResponseDto({
      success: true,
      data: this.service.getConstList(),
    });
  }
}
