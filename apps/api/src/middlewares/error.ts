import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse, ErrorCodes } from '@samithi/contracts';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: {
      code: err.code || ErrorCodes.INTERNAL_SERVER_ERROR,
      message: err.message || 'An unexpected error occurred',
    },
  };

  res.status(err.status || 500).json(errorResponse);
};
