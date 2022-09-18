import { HttpMessage, HttpStatus } from '@app/constants';
import { HttpException } from './http.exception';

export class ConflictException extends HttpException {
  public status: number = HttpStatus.CONFLICT;
  public message: string;

  constructor(message?: string) {
    super(message);
    this.message = message || HttpMessage.CONFLICT;
    Error.captureStackTrace(this, this.constructor);
  }
}
