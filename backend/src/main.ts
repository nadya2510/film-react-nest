import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { configProvider } from './app.config.provider';

async function bootstrap() {
  await mongoose
    .connect(configProvider.useValue.database.url)
    .then(() => console.log('mongoose connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/afisha');
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
