import { HttpMessage, HttpStatus } from '@app/constants';

export class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(message: string, status?: number) {
    super(message);
    this.message = message || HttpMessage.INTERNAL_SERVER_ERROR;
    this.status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    Error.captureStackTrace(this, this.constructor);
  }
}
