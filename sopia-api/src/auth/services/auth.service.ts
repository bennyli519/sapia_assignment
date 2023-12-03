import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { User, UserDocument } from '../../user/models/user.model';
import { RedisService } from '../../redis/serivces/redis.service';

const MAX_ATTEMPTS = 3;

@Injectable()
export class AuthService {
  logger: Logger;
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new NotFoundException('User account not found');

    const userId = user._id;
    let currentAttempts = await this.redisService.getLoginAttemptsById(userId);

    this.logger.log(
      'user currentAttempts:',
      `${userId}:${email}-currentAttempts`,
    );

    // update login attempts every time user tries to login
    await this.redisService.updateLoginAttempts(userId, ++currentAttempts);
    if (currentAttempts > MAX_ATTEMPTS) {
      throw new ForbiddenException(
        'sorry, your account was blocked due to too many login attempts',
      );
    }

    const isMatched = await this.isMatchedPassword(password, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid Password');

    return user;
  }

  async updateloginAttempts(userId: string, currentAttempts: number) {
    await this.redisService.updateLoginAttempts(userId, currentAttempts);
  }

  async signJwtToken(user: UserDocument) {
    return {
      access_token: this.jwtService.sign({
        userId: user._id,
      }),
    };
  }

  async isMatchedPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
