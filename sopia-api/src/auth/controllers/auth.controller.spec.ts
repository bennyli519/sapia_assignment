import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginOutputDTO } from '../dtos/login.output.dto';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a jwt token on successful login', async () => {
      const mockReturnValue = {
        access_token: '123',
      };

      const mockSignJwtToken = jest
        .spyOn(authService, 'signJwtToken')
        .mockResolvedValue(mockReturnValue);

      const mockParams = {
        user: {
          email: 'test@gmail.com',
          password: '12345678',
        },
      };

      const result: LoginOutputDTO = await authController.login(mockParams);

      expect(mockSignJwtToken).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(mockReturnValue);
    });

    it('should throw an error on login failure', async () => {
      jest
        .spyOn(authService, 'signJwtToken')
        .mockRejectedValue(new Error('Login failed'));

      const mockParams = {
        user: {
          email: 'test@gmail.com',
          password: '12345678',
        },
      };

      await expect(authController.login(mockParams)).rejects.toThrowError(
        'Login failed',
      );
    });
  });
});
