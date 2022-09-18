import { Request, Response, NextFunction } from 'express';

import { ErrorMessage, UserRoles } from '@app/constants';
import { ForbiddenException } from '@app/exceptions';

export const restrictTo =
  (...roles: UserRoles[]) =>
  (req: Request, _: Response, next: NextFunction): void => {
    const { role } = req['user'];
    if (!roles.includes(role)) {
      throw new ForbiddenException(ErrorMessage.PERMISSION_DENIED);
    }
    return next();
  };
