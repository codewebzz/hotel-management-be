import { ZodObject } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodObject, target: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const source = target === 'body' ? req.body : req.query;
    const parsed = schema.safeParse(source);
    if (parsed.success) {
      // attach parsed data back to the request
      if (target === 'body') req.body = parsed.data;
      else req.query = parsed.data as any;
      return next();
    }

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: parsed.error.format(),
    });
  };
};
