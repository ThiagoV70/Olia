import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getGlobalStats = async (req: AuthRequest, res: Response) => {
  try {
    // Total de óleo reciclado
    const totalOilRecycled = await prisma.donation.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { liters: true },
    });

    // Total de sabão produzido (aproximadamente 1 sabão para cada 5 litros)
    const soapProduced = Math.floor((totalOilRecycled._sum.liters || 0) / 5);

    // Total de escolas participantes
    const participatingSchools = await prisma.school.count({
      where: { isActive: true },
    });

    // Total de beneficiários (usuários com Bolsa Família)
    const beneficiaries = await prisma.user.count({
      where: { hasBolsaFamilia: true },
    });

    res.json({
      totalOilRecycled: totalOilRecycled._sum.liters || 0,
      soapProduced,
      participatingSchools,
      beneficiaries,
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas globais:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
};

export const getTopSchools = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const schools = await prisma.school.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        points: true,
        totalLiters: true,
        city: true,
      },
      orderBy: { points: 'desc' },
      take: parseInt(limit as string),
    });

    res.json(
      schools.map((school, index) => ({
        ...school,
        position: index + 1,
      }))
    );
  } catch (error: any) {
    console.error('Erro ao buscar top escolas:', error);
    res.status(500).json({ message: 'Erro ao buscar top escolas', error: error.message });
  }
};

export const getAllSchools = async (req: AuthRequest, res: Response) => {
  try {
    const { city, isActive } = req.query;

    const where: any = {};
    if (city) {
      where.city = city as string;
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const schools = await prisma.school.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        neighborhood: true,
        city: true,
        totalLiters: true,
        collectionCount: true,
        points: true,
        capacity: true,
        isActive: true,
        lat: true,
        lng: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(schools);
  } catch (error: any) {
    console.error('Erro ao buscar escolas:', error);
    res.status(500).json({ message: 'Erro ao buscar escolas', error: error.message });
  }
};

