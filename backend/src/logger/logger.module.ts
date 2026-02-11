import { Module } from '@nestjs/common';
import { LoggerApp } from './logger.service';

@Module({
  providers: [LoggerApp],
  exports: [LoggerApp],
})
export class LoggerModule {}
