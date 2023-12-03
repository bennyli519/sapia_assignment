import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginOutputDTO } from '../dtos/login.output.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<LoginOutputDTO> {
    try {
      return this.authService.signJwtToken(req.user);
    } catch (error) {
      throw error;
    }
  }
}
