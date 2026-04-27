import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedisHealthIndicator } from './indicators/redis.health';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @ApiOperation({
    summary: '전체 헬스 체크 (readiness)',
    description:
      'Mongo / Redis / Memory / Disk 의존성을 모두 점검합니다. K8s readinessProbe 용.',
  })
  @ApiResponse({ status: 200, description: '모든 의존성이 정상' })
  @ApiResponse({ status: 503, description: '하나 이상의 의존성이 비정상' })
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb', { timeout: 1500 }),
      () => this.redis.pingCheck('redis'),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
      () =>
        this.disk.checkStorage('disk', {
          path: process.platform === 'win32' ? 'C:\\' : '/',
          thresholdPercent: 0.9,
        }),
    ]);
  }

  @ApiOperation({
    summary: 'Liveness 체크',
    description:
      '프로세스가 응답 가능한지만 확인합니다. K8s livenessProbe 용 (의존성 미점검).',
  })
  @ApiResponse({ status: 200 })
  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @ApiOperation({
    summary: 'Readiness 체크',
    description:
      'Mongo / Redis 연결 가능 여부를 확인합니다. 트래픽 수신 준비 상태 점검용.',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 503 })
  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.mongoose.pingCheck('mongodb', { timeout: 1500 }),
      () => this.redis.pingCheck('redis'),
    ]);
  }
}
