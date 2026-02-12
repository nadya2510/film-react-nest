import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DevLogger } from './dev';
import { JsonLogger } from './json';
import { TskvLogger } from './tskv';

@Injectable()
export class LoggerApp implements LoggerService {
  public logger: LoggerService;

  constructor(private configService: ConfigService) {
    const logFormat = this.configService.get<string>('LOG_FORMAT') || 'dev';
    this.logger = this.createLogger(logFormat);
  }

  private createLogger(format: string): LoggerService {
    switch (format) {
      case 'json':
        return new JsonLogger();
      case 'tskv':
        return new TskvLogger();
      case 'dev':
      default:
        return new DevLogger();
    }
  }

  log(message: any, context?: string) {
    this.logger.log(message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, context);
  }
}
