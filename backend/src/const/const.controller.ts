import { Controller, Get } from '@nestjs/common';
import { ResponseDto } from 'src/common/common.dto';
import { Request } from 'express';
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
