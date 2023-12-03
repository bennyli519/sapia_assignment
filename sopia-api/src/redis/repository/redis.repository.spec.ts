import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../app.module';
import { RedisRepository } from '../repository/redis.repository';

interface RedisRepositoryInterface {
  get(prefix: string, key: string): Promise<string | null>;
  set(prefix: string, key: string, value: string): Promise<void>;
  delete(prefix: string, key: string): Promise<void>;
  setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void>;
}

const mockRedis = {
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('RedisRepository', () => {
  let testingModule: TestingModule;
  let redisRepository: RedisRepositoryInterface;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('RedisClient')
      .useValue(mockRedis)
      .compile();

    redisRepository = testingModule.get<RedisRepository>(RedisRepository);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await testingModule.close();
  });

  it('should correctly get key', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';
    mockRedis.get.mockResolvedValue(value);

    const result = await redisRepository.get(prefix, key);
    expect(result).toEqual(value);
    expect(mockRedis.get).toHaveBeenCalledTimes(1);
    expect(mockRedis.get).toHaveBeenCalledWith(`${prefix}:${key}`);
  });

  it('should correctly set key', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';

    await redisRepository.set(prefix, key, value);
    expect(mockRedis.set).toHaveBeenCalledTimes(1);
    expect(mockRedis.set).toHaveBeenCalledWith(`${prefix}:${key}`, value);
  });

  it('should correctly delete key', async () => {
    const prefix = 'prefix';
    const key = 'key';

    await redisRepository.delete(prefix, key);
    expect(mockRedis.del).toHaveBeenCalledTimes(1);
    expect(mockRedis.del).toHaveBeenCalledWith(`${prefix}:${key}`);
  });

  it('should correctly set key with expiry', async () => {
    const prefix = 'prefix';
    const key = 'key';
    const value = 'value';

    await redisRepository.setWithExpiry(prefix, key, value, 100);
    expect(mockRedis.set).toHaveBeenCalledWith(
      `${prefix}:${key}`,
      value,
      'EX',
      100,
    );
  });
});
