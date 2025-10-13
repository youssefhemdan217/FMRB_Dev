import { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
} from '../../domain/errors/DomainErrors';
import { serverConfig } from '../../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
      type: 'ValidationError',
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: err.message,
      type: 'UnauthorizedError',
    });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      error: err.message,
      type: 'ForbiddenError',
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: err.message,
      type: 'NotFoundError',
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error: err.message,
      type: 'ConflictError',
    });
  }

  // Generic server error
  return res.status(500).json({
    error: serverConfig.isDevelopment ? err.message : 'Internal server error',
    type: 'ServerError',
    ...(serverConfig.isDevelopment && { stack: err.stack }),
  });
};

