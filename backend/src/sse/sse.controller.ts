import { Controller, Get, Param, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Observable } from 'rxjs';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { SseMessageEvent } from './dto/sse-event.dto';
import { SseService } from './sse.service';

@ApiTags('SSE')
@Controller('events')
export class SseController {
  constructor(private readonly service: SseService) {}

  /**
   * SSE 스트림 구독 엔드포인트.
   *
   * - 인증: `@Roles` 합성 데코레이터가 `AuthGuard('jwt') + RolesGuard` 를 적용.
   * - 식별: URL 의 `:id` 는 클라이언트 자유 태그(재접속 추적용)로만 사용되고,
   *         실제 유저 매칭은 JWT 에서 뽑은 username 으로 이뤄진다.
   * - 토픽: `?topic=a,b` 로 관심 토픽을 콤마 구분하여 지정 가능.
   *         생략 시 권한 범위 안의 모든 토픽을 수신한다.
   */
  @ApiOperation({
    summary: 'SSE 구독',
    description:
      'JWT 로 식별된 사용자가 Server-Sent Events 스트림을 구독한다. (admin / super / manager)',
  })
  @ApiParam({ name: 'id', description: '클라이언트가 지정하는 연결 추적 태그' })
  @ApiQuery({
    name: 'topic',
    required: false,
    description: '콤마 구분 토픽 필터 (예: auth.code.update,board.comment)',
  })
  @SkipThrottle()
  @Roles('admin', 'super', 'manager')
  @Sse('sse/:id')
  sse(
    @Param('id') connectionTag: string,
    @CurrentUser('username') username: string,
    @Query('topic') topic?: string,
  ): Observable<SseMessageEvent> {
    const topics = topic
      ? topic
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    return this.service.addClient(username, connectionTag, topics);
  }

  /**
   * 현재 활성 SSE 연결 수를 반환한다.
   * 모니터링/운영 용도이므로 admin 전용.
   */
  @ApiOperation({
    summary: 'SSE 연결 통계',
    description: '현재 서버 인스턴스에 열려 있는 SSE 연결 수를 반환한다.',
  })
  @Roles('admin', 'super')
  @Get('stats')
  stats(): { activeClients: number } {
    return { activeClients: this.service.getActiveClientCount() };
  }
}
