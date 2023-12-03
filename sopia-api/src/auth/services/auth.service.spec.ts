import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../../user/services/user.service';
import { RedisService } from '../../redis/serivces/redis.service';
import {
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UserDocument } from '../../user/models/user.model';

jest.mock('bcryptjs');
jest.mock('@nestjs/jwt');
jest.mock('../../user/services/user.service');
jest.mock('../../redis/serivces/redis.service');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let userServiceMock: jest.Mocked<UserService>;
  let redisServiceMock: jest.Mocked<RedisService>;
  const mockUser = {
    _id: '123',
    fullName: 'test user',
    email: 'test@gmail.com',
    password: 'test',
  } as unknown as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            getLoginAttemptsById: jest.fn(),
            updateLoginAttempts: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtServiceMock = module.get<JwtService>(
      JwtService,
    ) as jest.Mocked<JwtService>;
    userServiceMock = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    redisServiceMock = module.get<RedisService>(
      RedisService,
    ) as jest.Mocked<RedisService>;
  });

  describe('validateUser', () => {
    it('should validate user and return user on success', async () => {
      userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);
      redisServiceMock.getLoginAttemptsById.mockResolvedValueOnce(0);
      authService.isMatchedPassword = jest.fn().mockResolvedValueOnce(true);

      const result = await authService.validateUser('test@gmail.com', 'test');

      expect(result).toEqual(mockUser);
      expect(redisServiceMock.updateLoginAttempts).toHaveBeenCalledWith(
        '123',
        0,
      );
    });

    it('should throw NotFoundException when user is not found', async () => {
      userServiceMock.getUserByEmail.mockResolvedValueOnce(null);

      await expect(
        authService.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw ForbiddenException when login attempts exceed the maximum', async () => {
      userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);
      redisServiceMock.getLoginAttemptsById.mockResolvedValueOnce(3);

      await expect(
        authService.validateUser('test@gmail.com', 'password'),
      ).rejects.toThrowError(ForbiddenException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);
      redisServiceMock.getLoginAttemptsById.mockResolvedValueOnce(2);
      authService.isMatchedPassword = jest.fn().mockResolvedValueOnce(false);

      await expect(
        authService.validateUser('test@gmail.com', 'invalid_password'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('updateloginAttempts', () => {
    it('should update login attempts in Redis', async () => {
      const userId = 'user_id';
      const currentAttempts = 2;

      redisServiceMock.getLoginAttemptsById.mockResolvedValueOnce(
        currentAttempts,
      );

      await authService.updateloginAttempts(userId, currentAttempts);

      expect(redisServiceMock.updateLoginAttempts).toHaveBeenCalledWith(
        userId,
        currentAttempts,
      );
    });
  });

  describe('signJwtToken', () => {
    it('should return access_token', async () => {
      jwtServiceMock.sign.mockReturnValueOnce('access_token');

      const result = await authService.signJwtToken(mockUser);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({ userId: '123' });
      expect(result).toStrictEqual({ access_token: 'access_token' });
    });
  });

  describe('isMatchedPassword', () => {
    it('should return true when passwords match', async () => {
      const plainTextPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await authService.isMatchedPassword(
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
    });

    it('should return false when passwords do not match', async () => {
      const plainTextPassword = 'password123';
      const hashedPassword = 'hashedPassword';

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await authService.isMatchedPassword(
        plainTextPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        plainTextPassword,
        hashedPassword,
      );
    });
  });
});
