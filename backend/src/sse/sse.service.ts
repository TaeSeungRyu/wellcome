import {
  Inject,
  Injectable,
  LoggerService,
  MessageEvent,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { filter, finalize, interval, map, merge, Observable, Subject } from 'rxjs';
import { SseEvent } from './dto/sse-event.dto';

/** 연결 유지를 위해 주기적으로 내려보내는 ping 간격(ms). */
const PING_INTERVAL_MS = 10_000;

@Injectable()
export class SseService {
  /**
   * 전역 이벤트 버스.
   * - 다른 서비스가 `publishEvent()` 로 다음(next) 값을 흘리면
   *   모든 구독자에게 fan-out 된다.
   * - 구독 이전 이벤트는 보관되지 않는다(= 재생 없음).
   */
  private readonly eventBus$ = new Subject<SseEvent>();

  /**
   * 10초 주기의 ping 스트림.
   * - 프록시/로드밸런서가 idle connection 을 끊지 않도록 keep-alive 역할.
   * - 별도 토픽 필터 없이 모든 클라이언트에 전달된다.
   */
  private readonly pingStream$: Observable<MessageEvent> = interval(
    PING_INTERVAL_MS,
  ).pipe(
    map(() => ({
      type: 'ping',
      data: { timestamp: new Date().toISOString() },
    })),
  );

  /** 현재 활성 SSE 연결 수. stats 엔드포인트에서 노출된다. */
  private activeClients = 0;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  onModuleDestroy() {
    // 모듈 종료 시 버스를 닫아 모든 구독자를 complete 시킨다.
    this.eventBus$.complete();
  }

  /**
   * 다른 서비스(예: AuthService)에서 이벤트를 발행할 때 사용.
   * 실제 전달 여부는 `addClient()` 단계의 필터가 결정한다.
   */
  publishEvent(event: SseEvent): void {
    this.eventBus$.next(event);
  }

  /**
   * 컨트롤러에서 호출해 SSE 연결 Observable 을 만든다.
   *
   * @param username    JWT 에서 추출한 접속자 username(= targetUserId 매칭 키)
   * @param connectionTag 연결 식별용 태그(SSE `id:` 필드로 전달되며,
   *                    클라이언트가 재접속 시 `Last-Event-ID` 로 다시 받음)
   * @param topics      관심 토픽 목록. 비어 있으면 모든 토픽을 수신.
   */
  addClient(
    username: string,
    connectionTag: string,
    topics: string[] = [],
  ): Observable<MessageEvent> {
    // 연결 수 집계 + 로깅(관측성)
    this.activeClients += 1;
    this.logger.log(
      `SSE connected: user=${username} tag=${connectionTag} topics=[${topics.join(',')}] active=${this.activeClients}`,
    );

    const eventStream$: Observable<MessageEvent> = this.eventBus$
      .asObservable()
      .pipe(
        // 1) 타겟 유저가 지정된 이벤트는 해당 유저에게만 전달
        filter(
          (event) => !event.targetUserId || event.targetUserId === username,
        ),
        // 2) 구독자가 토픽을 지정했다면 해당 토픽만 통과
        filter(
          (event) =>
            topics.length === 0 || !event.topic || topics.includes(event.topic),
        ),
        // 3) NestJS `@Sse` 가 요구하는 MessageEvent 형태로 매핑
        map((event) => ({
          id: connectionTag,
          type: event.topic ?? 'event',
          data: event.data ?? {},
        })),
      );

    // ping + 이벤트 스트림 합치고, 연결 종료 시 카운터 정리
    return merge(this.pingStream$, eventStream$).pipe(
      finalize(() => {
        this.activeClients = Math.max(0, this.activeClients - 1);
        this.logger.log(
          `SSE disconnected: user=${username} tag=${connectionTag} active=${this.activeClients}`,
        );
      }),
    );
  }

  /** 관리자 조회용 — 현재 열려 있는 SSE 연결 수. */
  getActiveClientCount(): number {
    return this.activeClients;
  }
}
