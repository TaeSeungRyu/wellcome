import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';

@Module({
  imports: [],
  providers: [SseService],
  controllers: [SseController],
  exports: [SseService],
})
export class SseModule {}
