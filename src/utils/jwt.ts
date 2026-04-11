import jwt from 'jsonwebtoken';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  companyId?: string;
}

export const generateToken = (payload: JWTPayload): string => {
  const jwtSecret = process.env.JWT_SECRET || '';
  const expiresIn = process.env.JWT_EXPIRES_IN ? String(process.env.JWT_EXPIRES_IN) : '24h';
//@ts-ignore
  return jwt.sign(payload, jwtSecret, { expiresIn });

};

export const verifyToken = (token: string): JWTPayload => {
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  return jwt.verify(token, jwtSecret) as JWTPayload;
};

