import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  fn(req, res, next).catch(next);
};
