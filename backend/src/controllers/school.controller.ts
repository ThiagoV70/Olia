import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getSchoolProfile = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        id: true,
        name: true,
        email: true,
        cnpj: true,
        address: true,
        neighborhood: true,
        city: true,
        lat: true,
        lng: true,
        responsibleName: true,
        responsiblePhone: true,
        responsibleEmail: true,
        storageCapacity: true,
        totalLiters: true,
        collectionCount: true,
        points: true,
        capacity: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!school) {
      return res.status(404).json({ message: 'Escola não encontrada' });
    }

    res.json(school);
  } catch (error: any) {
    console.error('Erro ao buscar perfil da escola:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};

export const updateSchoolProfile = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;
    const {
      name,
      address,
      neighborhood,
      city,
      responsibleName,
      responsiblePhone,
      responsibleEmail,
      storageCapacity,
      lat,
      lng,
    } = req.body;

    const school = await prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(neighborhood && { neighborhood }),
        ...(city && { city }),
        ...(responsibleName && { responsibleName }),
        ...(responsiblePhone && { responsiblePhone }),
        ...(responsibleEmail && { responsibleEmail }),
        ...(storageCapacity && { storageCapacity }),
        ...(lat !== undefined && { lat }),
        ...(lng !== undefined && { lng }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        cnpj: true,
        address: true,
        neighborhood: true,
        city: true,
        lat: true,
        lng: true,
        responsibleName: true,
        responsiblePhone: true,
        responsibleEmail: true,
        storageCapacity: true,
        totalLiters: true,
        collectionCount: true,
        points: true,
        capacity: true,
        isActive: true,
        updatedAt: true,
      },
    });

    res.json({ message: 'Perfil atualizado com sucesso', school });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};

export const getSchoolStats = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: {
        totalLiters: true,
        collectionCount: true,
        points: true,
        capacity: true,
      },
    });

    if (!school) {
      return res.status(404).json({ message: 'Escola não encontrada' });
    }

    // Calcular próxima recompensa (a cada 5000 pontos)
    const nextReward = Math.ceil(school.points / 5000) * 5000;
    const progress = ((school.points % 5000) / 5000) * 100;

    res.json({
      ...school,
      nextReward,
      progress: Math.min(progress, 100),
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
};

export const getSchoolRanking = async (req: AuthRequest, res: Response) => {
  try {
    const schools = await prisma.school.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        points: true,
      },
      orderBy: { points: 'desc' },
      take: 10,
    });

    const schoolId = req.user!.id;
    const currentSchoolIndex = schools.findIndex((s) => s.id === schoolId);
    const currentSchoolRank = currentSchoolIndex >= 0 ? currentSchoolIndex + 1 : null;

    res.json({
      ranking: schools.map((school, index) => ({
        ...school,
        position: index + 1,
      })),
      currentRank: currentSchoolRank,
    });
  } catch (error: any) {
    console.error('Erro ao buscar ranking:', error);
    res.status(500).json({ message: 'Erro ao buscar ranking', error: error.message });
  }
};

export const getAllSchoolsPublic = async (req: Request, res: Response) => {
  try {
    const { city, neighborhood } = req.query;

    const where: any = { isActive: true };
    if (city) {
      where.city = city as string;
    }
    if (neighborhood) {
      where.neighborhood = neighborhood as string;
    }

    const schools = await prisma.school.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        neighborhood: true,
        city: true,
        lat: true,
        lng: true,
        capacity: true,
      },
      orderBy: { name: 'asc' },
    });

    res.json(schools);
  } catch (error: any) {
    console.error('Erro ao buscar escolas:', error);
    res.status(500).json({ message: 'Erro ao buscar escolas', error: error.message });
  }
};

