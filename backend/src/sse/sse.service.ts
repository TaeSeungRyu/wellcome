import {
  Injectable,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { interval, map, merge, Observable, Subject } from 'rxjs';
import { SseEvent } from './dto/sse-event.dto';

const PING_INTERVAL_MS = 10_000;

@Injectable()
export class SseService implements OnModuleDestroy, OnModuleInit {
  /** 전역 이벤트 버스 */
  private readonly eventBus$ = new Subject<SseEvent>();

  /** 10초 주기의 Ping 스트림 */
  private readonly pingStream$: Observable<MessageEvent> = interval(
    PING_INTERVAL_MS,
  ).pipe(
    map(() => ({
      type: 'ping',
      data: { timestamp: new Date().toISOString() },
    })),
  );

  onModuleInit() {
    // merge 에서 통합 처리하므로 별도 초기화 없음
  }

  onModuleDestroy() {
    this.eventBus$.complete();
  }

  /** 다른 서비스에서 이벤트를 발행할 때 사용 */
  publishEvent(data: SseEvent): void {
    this.eventBus$.next(data);
  }

  /** Controller 에서 호출하여 SSE 연결을 형성 */
  addClient(id: string): Observable<MessageEvent> {
    const eventStream$: Observable<MessageEvent> = this.eventBus$
      .asObservable()
      .pipe(
        map((event) => ({
          id,
          type: 'event',
          data: event.data || {},
        })),
      );

    return merge(this.pingStream$, eventStream$);
  }
}
