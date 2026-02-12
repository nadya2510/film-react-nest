import { LoggerService, Injectable } from '@nestjs/common';
import { inspect } from 'util';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const logEntry = {
      level,
      message: this.stringifyMessage(message),
      context,
      timestamp: new Date().toISOString(),
      ...(trace && { trace }),
    };

    return JSON.stringify(logEntry);
  }

  private stringifyMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    if (message instanceof Error) {
      return message.stack || message.toString();
    }
    return inspect(message, { depth: 5, compact: true });
  }

  log(message: any, context?: string) {
    console.log(this.formatMessage('log', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatMessage('error', message, context, trace));
  }

  warn(message: any, context?: string) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: any, context?: string) {
    console.debug(this.formatMessage('debug', message, context));
  }

  verbose(message: any, context?: string) {
    console.log(this.formatMessage('verbose', message, context));
  }
}
