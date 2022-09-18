import { HttpMessage, HttpStatus } from '@app/constants';
import { HttpException } from './http.exception';

export class BadRequestException extends HttpException {
  public status: number = HttpStatus.BAD_REQUEST;
  public message: string;

  constructor(message?: string) {
    super(message);
    this.message = message || HttpMessage.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}
