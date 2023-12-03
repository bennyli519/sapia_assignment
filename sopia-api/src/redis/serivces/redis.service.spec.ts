import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { RedisRepository } from '../repository/redis.repository';

jest.mock('../repository/redis.repository');

describe('RedisService', () => {
  let redisService: RedisService;
  let redisRepositoryMock: jest.Mocked<RedisRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: RedisRepository,
          useValue: {
            setWithExpiry: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    redisService = module.get<RedisService>(RedisService);
    redisRepositoryMock = module.get<RedisRepository>(
      RedisRepository,
    ) as jest.Mocked<RedisRepository>;
  });

  describe('updateLoginAttempts', () => {
    it('should update login attempts in Redis', async () => {
      const userId = 'user_id';
      const attempts = 3;

      await redisService.updateLoginAttempts(userId, attempts);

      expect(redisRepositoryMock.setWithExpiry).toHaveBeenCalledWith(
        'loginAttempts',
        userId,
        '3',
        60 * 5,
      );
    });
  });

  describe('getLoginAttemptsById', () => {
    it('should return login attempts from Redis', async () => {
      const userId = 'user_id';
      const storedAttempts = '2';
      redisRepositoryMock.get.mockResolvedValueOnce(storedAttempts);

      const result = await redisService.getLoginAttemptsById(userId);

      expect(result).toEqual(2);
      expect(redisRepositoryMock.get).toHaveBeenCalledWith(
        'loginAttempts',
        userId,
      );
    });

    it('should return 0 if no login attempts are stored in Redis', async () => {
      const userId = 'user_id';
      redisRepositoryMock.get.mockResolvedValueOnce(null);

      const result = await redisService.getLoginAttemptsById(userId);

      expect(result).toEqual(0);
      expect(redisRepositoryMock.get).toHaveBeenCalledWith(
        'loginAttempts',
        userId,
      );
    });
  });
});
