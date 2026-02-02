import { Module } from '@nestjs/common';
import { ConstController } from './const.controller';
import { ConstService } from './const.service';

/**
 * 서버와 클라이언트에서 공통으로 사용하는 상수 데이터를 제공하는 모듈
 */
@Module({
  controllers: [ConstController],
  providers: [ConstService],
  exports: [],
})
export class ConstModule {}
