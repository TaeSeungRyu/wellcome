import { Controller, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Roles } from '../common/decorators/roles.decorator';
import { SseMessageEvent } from './dto/sse-event.dto';
import { SseService } from './sse.service';

@Controller('events')
export class SseController {
  constructor(private readonly service: SseService) {}

  @Roles('admin', 'super', 'manager')
  @Sse('sse/:id')
  sse(@Param('id') id: string): Observable<SseMessageEvent> {
    return this.service.addClient(id);
  }
}
