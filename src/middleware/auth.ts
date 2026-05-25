import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SendError } from '../utils/response';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    companyId?: string;
    branchId?: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return SendError(res, 'Access token is required', 401);
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return SendError(res, 'Invalid or expired token', 403);
    }

    req.user = decoded;
    next();
  });
};

export const injectUserBranch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return SendError(res, 'Authentication required', 401);
  }

  try {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: req.user.id },
    });
    if (user?.branchId) {
      req.user.branchId = user.branchId;
    }
    next();
  } catch (error) {
    return SendError(res, 'Error fetching user branch context', 500, error);
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return SendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return SendError(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

export const authenticateUser = [authenticateToken, injectUserBranch];
