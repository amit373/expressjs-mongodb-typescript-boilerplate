import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { UnauthorizedException } from '@app/exceptions';
import { ErrorMessage } from '@app/constants';
import { jwtService } from '@app/services';
import { userModel } from '@app/models';
import { asyncHandler } from './async-handler.middleware';

// @desc   Verify Token Middleware
export const authMiddleware = asyncHandler(async (req: any, _: Response, next: NextFunction) => {
  // 1) Getting token and check of it's there
  let token = undefined;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    // eslint-disable-next-line prefer-destructuring
    token = authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new UnauthorizedException(ErrorMessage.NOT_LOGGED_IN));
  }

  // 2) Verification token
  const decoded: string | JwtPayload = await jwtService.verifyToken(token);
  if (!decoded || !decoded['id']) {
    return next(new UnauthorizedException(ErrorMessage.USER_WITH_TOKEN_NOT_EXIST));
  }

  // 3) Check if user still exists
  const currentUser = await userModel.findById(decoded['id']);
  if (!currentUser) {
    return next(new UnauthorizedException(ErrorMessage.USER_WITH_TOKEN_NOT_EXIST));
  }

  // Check if user changed password after the token was issued
  if (currentUser?.changedPasswordAfter(decoded['iat'])) {
    return next(new UnauthorizedException(ErrorMessage.RECENTLY_CHANGED_PASSWORD));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req['user'] = currentUser;
  return next();
});
