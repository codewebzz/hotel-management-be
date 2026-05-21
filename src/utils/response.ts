import { Response } from 'express';

/**
 * Sends a standardized success response.
 * 
 * @param res - Express response object
 * @param message - Descriptive success message
 * @param data - Payload to be returned
 * @param statusCode - HTTP status code (default: 200)
 * @param extra - Any additional top-level properties (e.g. pagination, total)
 */
export const SendSuccess = (
  res: Response,
  message: string,
  data?: any,
  statusCode = 200,
  extra: Record<string, any> = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...extra,
  });
};

/**
 * Sends a standardized error response.
 * 
 * @param res - Express response object
 * @param message - Descriptive error message
 * @param statusCode - HTTP status code (default: 500)
 * @param error - The actual error object or message (e.g. from a try-catch block)
 * @param extra - Any additional top-level properties (e.g. validation errors detail)
 */
export const SendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: any,
  extra: Record<string, any> = {}
) => {
  let errorDetail: string | undefined;

  if (error) {
    if (error instanceof Error) {
      errorDetail = error.message;
    } else if (typeof error === 'string') {
      errorDetail = error;
    } else {
      errorDetail = String(error);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(errorDetail !== undefined && { error: errorDetail }),
    ...extra,
  });
};
