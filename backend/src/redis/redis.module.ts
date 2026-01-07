import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: () => {
        return new Redis({
          host: process?.env?.REDIS_HOST as string,
          port: 6379,
        });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
