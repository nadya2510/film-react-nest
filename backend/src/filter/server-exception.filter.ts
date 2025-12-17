import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ServerException } from '../exceptions/server.exception';

@Catch(ServerException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.status(exception.getStatus()).json({
      error: message,
    });
  }
}
