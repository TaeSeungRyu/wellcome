/**
 * NestJS `@Sse` 핸들러의 반환 타입과 모양을 맞춘 메시지 구조.
 * - `data`: 클라이언트가 JSON 으로 받을 실제 페이로드
 * - `id`: 재접속 시 `Last-Event-ID` 로 재사용되는 식별자
 * - `type`: `EventSource.addEventListener(type, ...)` 로 구독할 이벤트 이름
 */
export interface SseMessageEvent {
  data: string | object;
  id?: string;
  type?: string;
}

/**
 * 다른 서비스가 `SseService.publishEvent()` 로 발행하는 이벤트의 타입.
 *
 * - `data`: 클라이언트에 그대로 전달될 페이로드
 * - `topic`: 구독자가 필터링하는 채널 키. 미지정 시 전체 브로드캐스트.
 * - `targetUserId`: 특정 사용자(username)에게만 보내고 싶을 때 지정.
 *                   미지정 시 토픽 구독자 전원에게 전달.
 */
export type SseEvent = {
  data: string | object;
  topic?: string;
  targetUserId?: string;
};
