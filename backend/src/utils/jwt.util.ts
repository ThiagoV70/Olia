import jwt from 'jsonwebtoken';

export const generateToken = (payload: {
  id: string;
  email: string;
  type: 'USER' | 'SCHOOL' | 'GOVERNMENT';
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
};

