import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from '../../src/auth/services/auth.service';
import { UserService } from '../../src/user/services/user.service';
import { RedisService } from '../../src/redis/serivces/redis.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../../src/auth/controllers/auth.controller';
import { UserDocument } from '../../src/user/models/user.model';
import { generateHashPassword } from '../../src/common/helper/utils';
import { LocalStrategy } from '../../src/auth/strategy/local.strategy';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let userServiceMock: jest.Mocked<UserService>;
  let redisServiceMock: jest.Mocked<RedisService>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        LocalStrategy,
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

    jwtServiceMock = moduleFixture.get<JwtService>(
      JwtService,
    ) as jest.Mocked<JwtService>;
    userServiceMock = moduleFixture.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    redisServiceMock = moduleFixture.get<RedisService>(
      RedisService,
    ) as jest.Mocked<RedisService>;

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - Successful Login', async () => {
    const mockUser = {
      _id: '111',
      email: 'test@gmail.com',
      password: await generateHashPassword('test'),
    } as unknown as UserDocument;

    userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);
    jwtServiceMock.sign.mockReturnValueOnce('access_token');

    const validCredentials = {
      email: 'test@gmail.com',
      password: 'test',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(validCredentials)
      .expect(201);

    expect(response.body).toHaveProperty('access_token');
  });

  it('/auth/login (POST) - User Not Found', async () => {
    const mockUser = {
      email: 'nonexistent@example.com',
      password: 'somepassword',
    } as unknown as UserDocument;

    userServiceMock.getUserByEmail.mockResolvedValueOnce(null);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(404);
  });

  it('/auth/login (POST) - Invalid Password', async () => {
    const mockUser = {
      email: 'test@gmail.com',
      password: 'wrongpassword',
    } as unknown as UserDocument;

    userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(401);
  });

  it('/auth/login (POST) - blocked account', async () => {
    const mockUser = {
      email: 'test@gmail.com',
      password: 'wrongpassword',
    } as unknown as UserDocument;

    const mockCurrentAttempts = 4;

    userServiceMock.getUserByEmail.mockResolvedValueOnce(mockUser);
    redisServiceMock.getLoginAttemptsById.mockResolvedValueOnce(
      mockCurrentAttempts,
    );

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(403);
  });
});
