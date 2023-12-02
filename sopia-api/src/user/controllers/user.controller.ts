import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoginInput } from '../dtos/login.input';
import { LoginOutput } from '../dtos/login.output';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: LoginInput): Promise<LoginOutput> {
    const { email } = body;
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const token = 'token';

    const loginOutput: LoginOutput = {
      token,
    };

    return loginOutput;
  }
}
