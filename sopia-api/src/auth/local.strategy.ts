import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  logger: Logger;
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger = new Logger(LocalStrategy.name);
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);

    this.logger.log('checking at local auth:', user.email);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
