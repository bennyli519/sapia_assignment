import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.PORT, 10) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('portm', PORT);
  await app.listen(PORT);
}
bootstrap();
