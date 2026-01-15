import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  InvalidRequest = 400,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.InvalidRequest, 'Client sent invalid request'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.InvalidRequest, HttpStatus.BAD_REQUEST],
]);
