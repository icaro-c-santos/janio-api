import { Request, Response, NextFunction } from 'express';

export function contextMiddleware( /// TODO: Implement context middleware with userId
  req: Request,
  res: Response,
  next: NextFunction,
) {
  next();
}
