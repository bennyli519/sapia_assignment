import { Module } from '@nestjs/common';

import { redisClientFactory } from './redis.client.factory';
import { RedisRepository } from './repository/redis.repository';
import { RedisService } from './serivces/redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [redisClientFactory, RedisRepository, RedisService],
  exports: [RedisService],
})
export class RedisModule {}
