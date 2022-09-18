import { NextFunction, Request, Response } from 'express';

import { logger } from '@app/libs';
import { ErrorMessage, HttpMessage, HttpStatus } from '@app/constants';
import { BadRequestException, UnauthorizedException } from '@app/exceptions';
import { config } from '@app/config';

const handleCastErrorDB = (err: any): BadRequestException => {
  const message = `Invalid ${err?.path}: ${err?.value}.`;
  return new BadRequestException(message);
};

const handleDuplicateFieldsDB = (err: any): BadRequestException => {
  const value = err?.message?.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new BadRequestException(message);
};

const handleValidationErrorDB = (err: any): BadRequestException => {
  const errors = Object.values(err?.errors)?.map((el: any) => el?.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new BadRequestException(message);
};

const logError = (err: any, req: Request, res: Response): void => {
  const message: string = err?.message || res?.statusMessage || ErrorMessage.SOMETHING_WENT_WRONG;
  logger.error(`${err?.status} - ${req.originalUrl} [${req.method}] - ${message} `);
};

const handleJWTError = (err: any): UnauthorizedException => {
  const error = { ...err, message: ErrorMessage.INVALID_TOKEN };
  return new UnauthorizedException(error.message);
};

const handleJWTExpiredError = (err: any): UnauthorizedException => {
  const error = { ...err, message: ErrorMessage.TOKEN_EXPIRED };
  return new UnauthorizedException(error.message);
};

const sendError = (err: any, req: Request, res: Response) => {
  if (config.isDevelopment) {
    console.error('Error 💥', {
      status: err.status,
      method: req.method,
      path: req.path,
      timestamp: new Date(),
      message: err.message,
    });
  }
  logError(err, req, res);
  return res.status(err.status).json({
    status: err.status,
    message: err.message,
  });
};

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction): void => {
  try {
    let error = { ...err }; // Don't change to const
    error.status = err?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.message = err?.message || HttpMessage.INTERNAL_SERVER_ERROR;
    if (error?.name === 'CastError') error = handleCastErrorDB(error);
    if (error?.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error?.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error?.name === 'JsonWebTokenError') error = handleJWTError(err);
    if (error?.name === 'TokenExpiredError') error = handleJWTExpiredError(err);
    sendError(error, req, res);
  } catch (error) {
    next(error);
  }
};
