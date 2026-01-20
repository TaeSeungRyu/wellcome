import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Response } from 'express';
import { BehaviorSubject, map, Observable, ReplaySubject } from 'rxjs';
import { SseMessageEvent, SseClient, SseEvent } from './sse.dto';

//TODO : 이벤트를 주고받기 위한 타입이 정의되어 있지 않습니다.
@Injectable()
export class SseService implements OnModuleDestroy, OnModuleInit {
  private clients: SseClient[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  //다른 도메인에서 발생한 이벤트를 전달하기 위한 객체
  private eventBus: BehaviorSubject<SseEvent>;
  constructor() {
    this.eventBus = new BehaviorSubject({
      event: '',
      data: {},
      id: '',
    });
  }

  onModuleInit() {
    this.pintRunner();
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  pintRunner() {
    this.intervalId = setInterval(() => {
      this.publishEvent({
        event: 'ping',
        data: {},
        id: '',
      });
    }, 1000 * 10); // 1분마다 ping 이벤트 발행
  }

  /**
   * @param data 이벤트 전달용 데이터 입니다.
   */
  publishEvent(data: SseEvent) {
    this.eventBus.next(data);
  }

  /**
   * 이벤트 구독을 실행 합니다.
   */
  runSubscribe() {
    this.eventBus.subscribe((data) => {
      this.clients.forEach((stream) => {
        stream.subject.next({
          event: data.event,
          data: data || {},
        });
      });
    });
  }

  /**
   * 이벤트 구독을 종료 합니다.
   */
  stopSubscribe() {
    if (this.eventBus) {
      this.eventBus.unsubscribe();
    }
  }

  /**
   *
   * @param response 브라우저의 응답 객체 입니다.
   * @returns 브라우저에 전송할 데이터 입니다.
   * @description 접속한 브라우저의 커넥션을 담고 있는 객체를 생성합니다.
   */
  addClient(id: string, response: Response): Observable<SseMessageEvent> {
    //ID를 가지고 로그인 했는지 조사하는 기능이 필요 합니다.
    const subject = new ReplaySubject<SseClient>();
    const observer = subject.asObservable();
    this.clients.push({ id, subject, observer, response });

    return observer.pipe(
      map((data) => {
        //브라우저에 전송할 데이터
        const result: SseMessageEvent = {
          id,
          data: data || {},
        };
        return result;
      }),
    );
  }
}
