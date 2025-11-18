import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const requestCollection = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;
    const { requestedLiters, preferredDate } = req.body;

    if (!requestedLiters || !preferredDate) {
      return res.status(400).json({ message: 'Quantidade e data são obrigatórios' });
    }

    const collection = await prisma.collection.create({
      data: {
        schoolId,
        requestedLiters: parseFloat(requestedLiters),
        preferredDate: new Date(preferredDate),
        status: 'PENDING',
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Coleta solicitada com sucesso',
      collection,
    });
  } catch (error: any) {
    console.error('Erro ao solicitar coleta:', error);
    res.status(500).json({ message: 'Erro ao solicitar coleta', error: error.message });
  }
};

export const getSchoolCollections = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;

    const collections = await prisma.collection.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(collections);
  } catch (error: any) {
    console.error('Erro ao buscar coletas:', error);
    res.status(500).json({ message: 'Erro ao buscar coletas', error: error.message });
  }
};

export const getAllCollections = async (req: AuthRequest, res: Response) => {
  try {
    const { status, city } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (city) {
      where.school = {
        city: city as string,
      };
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            neighborhood: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(collections);
  } catch (error: any) {
    console.error('Erro ao buscar coletas:', error);
    res.status(500).json({ message: 'Erro ao buscar coletas', error: error.message });
  }
};

export const scheduleCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduledDate } = req.body;

    if (!scheduledDate) {
      return res.status(400).json({ message: 'Data agendada é obrigatória' });
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        scheduledDate: new Date(scheduledDate),
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
          },
        },
      },
    });

    res.json({
      message: 'Coleta agendada com sucesso',
      collection,
    });
  } catch (error: any) {
    console.error('Erro ao agendar coleta:', error);
    res.status(500).json({ message: 'Erro ao agendar coleta', error: error.message });
  }
};

export const completeCollection = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { collectedLiters } = req.body;

    if (!collectedLiters) {
      return res.status(400).json({ message: 'Quantidade coletada é obrigatória' });
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: { school: true },
    });

    if (!collection) {
      return res.status(404).json({ message: 'Coleta não encontrada' });
    }

    const liters = parseFloat(collectedLiters);
    const points = Math.round(liters * 10); // 10 pontos por litro

    // Atualizar coleta
    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        collectedLiters: liters,
        completedDate: new Date(),
        points,
      },
    });

    // Atualizar estatísticas da escola
    await prisma.school.update({
      where: { id: collection.schoolId },
      data: {
        collectionCount: {
          increment: 1,
        },
        points: {
          increment: points,
        },
        capacity: 0, // Resetar capacidade após coleta
        totalLiters: {
          increment: liters,
        },
      },
    });

    res.json({
      message: 'Coleta concluída com sucesso',
      collection: updatedCollection,
    });
  } catch (error: any) {
    console.error('Erro ao concluir coleta:', error);
    res.status(500).json({ message: 'Erro ao concluir coleta', error: error.message });
  }
};

