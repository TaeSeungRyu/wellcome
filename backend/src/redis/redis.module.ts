import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () =>
        new Redis({
          host: process?.env?.REDIS_HOST as string,
          port: 6379,
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
