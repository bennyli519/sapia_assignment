import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly UserService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  async validate(payload: { userId: string }) {
    this.logger.log('Validate passport payload:', payload);
    return await this.UserService.getUserByEmail(payload.userId);
  }
}
