import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const { isRead } = req.query;

    const where: any = {};

    if (user.type === 'USER') {
      where.userId = user.id;
    } else if (user.type === 'SCHOOL') {
      where.schoolId = user.id;
    } else {
      // Governo vê todas as notificações
      where.userId = null;
      where.schoolId = null;
    }

    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(notifications);
  } catch (error: any) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ message: 'Erro ao buscar notificações', error: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notificação não encontrada' });
    }

    // Verificar se a notificação pertence ao usuário
    if (user.type === 'USER' && notification.userId !== user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    if (user.type === 'SCHOOL' && notification.schoolId !== user.id) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ message: 'Notificação marcada como lida', notification: updated });
  } catch (error: any) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({ message: 'Erro ao marcar notificação', error: error.message });
  }
};

export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { type, title, message, userId, schoolId } = req.body;

    if (!type || !message) {
      return res.status(400).json({ message: 'Tipo e mensagem são obrigatórios' });
    }

    // Se não especificar userId ou schoolId, criar para todos
    if (!userId && !schoolId) {
      // Criar notificação para todos os usuários
      const users = await prisma.user.findMany({ select: { id: true } });
      const schools = await prisma.school.findMany({ select: { id: true } });

      const notifications = await Promise.all([
        ...users.map((user) =>
          prisma.notification.create({
            data: {
              type,
              title,
              message,
              userId: user.id,
            },
          })
        ),
        ...schools.map((school) =>
          prisma.notification.create({
            data: {
              type,
              title,
              message,
              schoolId: school.id,
            },
          })
        ),
      ]);

      return res.status(201).json({
        message: 'Notificações criadas com sucesso',
        count: notifications.length,
      });
    }

    // Criar notificação específica
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        userId,
        schoolId,
      },
    });

    res.status(201).json({
      message: 'Notificação criada com sucesso',
      notification,
    });
  } catch (error: any) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ message: 'Erro ao criar notificação', error: error.message });
  }
};

