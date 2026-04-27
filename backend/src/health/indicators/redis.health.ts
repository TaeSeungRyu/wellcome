import { Inject, Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    super();
  }

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    try {
      const reply = await this.redis.ping();
      const isHealthy = reply === 'PONG';
      const result = this.getStatus(key, isHealthy, { reply });
      if (!isHealthy) {
        throw new HealthCheckError('Redis ping failed', result);
      }
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown';
      throw new HealthCheckError(
        'Redis ping failed',
        this.getStatus(key, false, { message }),
      );
    }
  }
}
