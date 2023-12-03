import { Controller, Get, Header } from '@nestjs/common';
@Controller()
export class AppController {
  @Get('/')
  @Header('Content-Type', 'text/plain')
  index(): string {
    return 'OK';
  }

  @Get('/health')
  @Header('Content-Type', 'text/plain')
  health(): string {
    return 'OK';
  }
}
