import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessageEvent } from '@nestjs/common'; // NestJS에서 제공하는 SSE 이벤트 타입
import { Subject, map, Observable, interval, merge } from 'rxjs';
import { SseEvent } from './sse.dto';

@Injectable()
export class SseService implements OnModuleDestroy, OnModuleInit {
  // 1. 전역 이벤트 버스 (BehaviorSubject 대신 Subject 사용)
  // SseEvent 타입으로 이벤트를 받습니다.
  private eventBus$ = new Subject<SseEvent>();

  // 2. 10초 주기의 Ping 스트림
  // MessageEvent 형식을 반환하도록 타입을 명시합니다.
  private pingStream$: Observable<MessageEvent> = interval(10000).pipe(
    map(() => ({
      type: 'ping',
      data: { timestamp: new Date().toISOString() },
    })),
  );

  onModuleInit() {
    // 별도의 pintRunner 실행 없이 merge에서 처리됩니다.
  }

  onModuleDestroy() {
    this.eventBus$.complete();
  }

  /**
   * 다른 서비스에서 이벤트를 발행할 때 사용
   */
  publishEvent(data: SseEvent): void {
    this.eventBus$.next(data);
  }

  /**
   * Controller에서 호출하여 SSE 연결을 형성
   */
  addClient(id: string): Observable<MessageEvent> {
    // 3. 이벤트 버스를 MessageEvent 형식으로 변환
    const eventStream$: Observable<MessageEvent> = this.eventBus$
      .asObservable()
      .pipe(
        map((event) => ({
          id: id,
          type: 'event', // 클라이언트가 수신할 이벤트명 (addEventListener('이벤트명'))
          data: event.data || {},
        })),
      );

    // 4. 핑과 이벤트를 합침 (두 스트림 모두 MessageEvent 타입이므로 오류 발생 안 함)
    return merge(this.pingStream$, eventStream$);
  }
}
