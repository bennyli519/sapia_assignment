import {
  Injectable,
  forwardRef,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { User } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private UserService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UserService.getUserByEmail(email);
    if (!user) throw new NotFoundException('User account not found');

    const isMatched = await this.comparePasswords(password, user.password);
    if (!isMatched) throw new UnauthorizedException('Invalid Password');

    return user;
  }

  async signJwtToken(
    user: User & {
      _id: string;
    },
  ) {
    return {
      access_token: this.jwtService.sign({
        userId: user._id,
      }),
    };
  }

  async generateHashPassword(plainTextPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(8);
    return bcrypt.hash(plainTextPassword, salt);
  }

  async comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
