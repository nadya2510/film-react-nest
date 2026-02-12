/*import { HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { code2message, code2status, ErrorCode } from './error-codes';
import { createLogger } from '../logger/logger';

export class ServerException extends HttpException {
  public code: ErrorCode;
  private readonly logger: LoggerService;
  constructor(code: ErrorCode) {
    const message = code2message.get(code) || 'Error occurred, please try again later';
    const status =  code2status.get(code) || HttpStatus.INTERNAL_SERVER_ERROR;
    super(
      message,
      status
    );

    this.code = code;
     // Логируем ошибку при создании исключения
    this.logger.error(
      `ServerException (code=${code}): ${message}`,
      'ServerException',
      `StatusCode: ${status}, Stack: ${this.stack}`
    );
  }
}*/
import { HttpException, HttpStatus } from '@nestjs/common';
import { code2message, code2status, ErrorCode } from './error-codes';

export class ServerException extends HttpException {
  public code: ErrorCode;

  constructor(code: ErrorCode) {
    super(
      code2message.get(code) || 'Error occurred, please try again later',
      code2status.get(code) || HttpStatus.INTERNAL_SERVER_ERROR,
    );

    this.code = code;
  }
}
