import { Inject, Injectable } from '@nestjs/common';

import { RedisRepository } from '../repository/redis.repository';

const FiveMinsInSeconds = 60 * 5;

enum RedisPrefixEnum {
  LOGIN_ATTEMPTS = 'loginAttempts',
}

@Injectable()
export class RedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async updateLoginAttempts(userId: string, attempts = 0): Promise<void> {
    await this.redisRepository.setWithExpiry(
      RedisPrefixEnum.LOGIN_ATTEMPTS,
      userId,
      String(attempts),
      FiveMinsInSeconds,
    );
  }

  async getLoginAttemptsById(userId: string): Promise<number> {
    const loginAttempts = await this.redisRepository.get(
      RedisPrefixEnum.LOGIN_ATTEMPTS,
      userId,
    );
    return Number(loginAttempts) ?? 0;
  }
}
