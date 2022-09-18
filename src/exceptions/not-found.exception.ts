import { HttpMessage, HttpStatus } from '@app/constants';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  public status: number = HttpStatus.NOT_FOUND;
  public message: string;

  constructor(message?: string) {
    super(message);
    this.message = message || HttpMessage.NOT_FOUND;
    Error.captureStackTrace(this, this.constructor);
  }
}
