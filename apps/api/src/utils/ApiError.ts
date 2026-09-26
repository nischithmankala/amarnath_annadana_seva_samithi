import { ErrorCodes } from '@samithi/contracts';

export class ApiError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    errorCode: string = ErrorCodes.INTERNAL_SERVER_ERROR,
    message: string = 'Something went wrong',
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
