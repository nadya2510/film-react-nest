import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private context: string;

  private formatTskv(
    level: string,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    // Собираем поля
    const fields: string[] = [];

    fields.push(`level=${level}`);
    fields.push(`message=${this.stringifyValue(message)}`);
    fields.push(`context=${context || this.context}`);
    fields.push(`timestamp=${new Date().toISOString()}`);

    if (trace) {
      fields.push(`trace=${this.stringifyValue(trace)}`);
    }

    return fields.join('\t') + '\n';
  }

  private stringifyValue(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value === null || value === undefined) {
      return '';
    }
    return JSON.stringify(value);
  }

  log(message: any, context?: string) {
    console.log(this.formatTskv('log', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.log(this.formatTskv('error', message, context, trace));
  }

  warn(message: any, context?: string) {
    console.log(this.formatTskv('warn', message, context));
  }

  debug(message: any, context?: string) {
    console.log(this.formatTskv('debug', message, context));
  }

  verbose(message: any, context?: string) {
    console.log(this.formatTskv('verbose', message, context));
  }
}
