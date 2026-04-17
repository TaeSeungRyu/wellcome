import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: '헬스 체크 / 기본 메시지',
    description:
      '서버가 정상 동작 중인지 확인할 때 사용하는 기본 엔드포인트입니다.',
  })
  @ApiResponse({ status: 200, description: '서버 인사 메시지 문자열' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
