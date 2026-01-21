import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { v4 as uuidv4 } from 'uuid';

// Полифилл для crypto.randomUUID (если отсутствует)
if (typeof global.crypto === 'undefined') {
  (global as any).crypto = {
    randomUUID: uuidv4,
    getRandomValues: function (buffer: any) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    },
  };
}


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
