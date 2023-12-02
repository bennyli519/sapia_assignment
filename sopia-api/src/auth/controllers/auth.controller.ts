import { Controller, Post, Logger, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginOutput } from '../dtos/login.output';

@Controller('auth')
export class AuthController {
  logger: Logger;
  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginOutput> {
    try {
      return this.authService.signJwtToken(req.user);
    } catch (error) {
      throw error;
    }
  }
}
