import { HttpMessage, HttpStatus } from '@app/constants';
import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  public status: number = HttpStatus.UNAUTHORIZED;
  public message: string;

  constructor(message?: string) {
    super(message);
    this.message = message || HttpMessage.UNAUTHORIZED;
    Error.captureStackTrace(this, this.constructor);
  }
}
