import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger';
import { failure } from '../utils/response';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // express-validator array of errors
  const valErrors = validationResult(_req);
  if (!valErrors.isEmpty()) {
    res.status(422).json(failure('Validation failed', valErrors.array().map(e => e.msg)));
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) logger.error('Non-operational error:', err);
    res.status(err.statusCode).json(failure(err.message));
    return;
  }

  // Mongoose duplicate key
  if ((err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json(failure('A record with that value already exists'));
    return;
  }

  // Unknown errors
  logger.error('Unhandled error:', err);
  res.status(500).json(failure('Internal server error'));
}
