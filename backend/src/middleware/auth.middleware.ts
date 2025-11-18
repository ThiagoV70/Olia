import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    type: 'USER' | 'SCHOOL' | 'GOVERNMENT';
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

    // Verificar se o usuário ainda existe
    let user;
    if (decoded.type === 'USER') {
      user = await prisma.user.findUnique({ where: { id: decoded.id } });
    } else if (decoded.type === 'SCHOOL') {
      user = await prisma.school.findUnique({ where: { id: decoded.id } });
    } else if (decoded.type === 'GOVERNMENT') {
      user = await prisma.government.findUnique({ where: { id: decoded.id } });
    }

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = {
      id: decoded.id,
      type: decoded.type,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const requireUserType = (...types: ('USER' | 'SCHOOL' | 'GOVERNMENT')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    if (!types.includes(req.user.type)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
};

