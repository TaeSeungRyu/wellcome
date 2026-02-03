import {
  Controller,
  OnModuleDestroy,
  OnModuleInit,
  Param,
  Sse,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { SseService } from './sse.service';
import { SseMessageEvent } from './sse.dto';
import { Role } from 'src/auth/role.decorator';

@Controller('events')
export class SseController implements OnModuleInit, OnModuleDestroy {
  constructor(private service: SseService) {}

  public onModuleInit(): void {
    //  this.service.runSubscribe();
  }

  public onModuleDestroy(): void {
    // this.service.stopSubscribe();
  }

  @Role('admin', 'super', 'manager')
  @Sse('sse/:id')
  sse(@Param('id') id: string): Observable<SseMessageEvent> {
    console.log(`SSE connection established for client ID: ${id}`);
    return this.service.addClient(id);
  }
}
