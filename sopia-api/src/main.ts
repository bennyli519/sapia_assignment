import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = parseInt(process.env.PORT, 10) || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('portm', PORT);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));

  await app.listen(PORT);
}
bootstrap();
