import { Controller, Param, Sse } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators/roles.decorator';
import { SseMessageEvent } from './dto/sse-event.dto';
import { SseService } from './sse.service';

@ApiTags('SSE')
@Controller('events')
export class SseController {
  constructor(private readonly service: SseService) {}

  @ApiOperation({
    summary: 'SSE 구독',
    description:
      '클라이언트 ID를 기반으로 Server-Sent Events 스트림을 구독합니다. (admin / super / manager 권한)',
  })
  @ApiParam({ name: 'id', description: 'SSE 구독자 고유 식별자' })
  @Roles('admin', 'super', 'manager')
  @Sse('sse/:id')
  sse(@Param('id') id: string): Observable<SseMessageEvent> {
    return this.service.addClient(id);
  }
}
