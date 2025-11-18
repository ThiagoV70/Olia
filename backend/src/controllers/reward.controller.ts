import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const getRewards = async (req: AuthRequest, res: Response) => {
  try {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { points: 'asc' },
    });

    // Se for escola, verificar quais recompensas já foram solicitadas
    if (req.user?.type === 'SCHOOL') {
      const schoolId = req.user.id;
      const requests = await prisma.rewardRequest.findMany({
        where: { schoolId },
        select: { rewardId: true, status: true },
      });

      const rewardsWithStatus = rewards.map((reward) => {
        const request = requests.find((r) => r.rewardId === reward.id);
        return {
          ...reward,
          available: !request || request.status === 'DENIED',
          unlocked: request?.status === 'APPROVED',
          requested: request?.status === 'PENDING',
        };
      });

      return res.json(rewardsWithStatus);
    }

    res.json(rewards);
  } catch (error: any) {
    console.error('Erro ao buscar recompensas:', error);
    res.status(500).json({ message: 'Erro ao buscar recompensas', error: error.message });
  }
};

export const requestReward = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;
    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ message: 'ID da recompensa é obrigatório' });
    }

    // Verificar se a recompensa existe
    const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
    if (!reward) {
      return res.status(404).json({ message: 'Recompensa não encontrada' });
    }

    // Verificar se a escola tem pontos suficientes
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school || school.points < reward.points) {
      return res.status(400).json({ message: 'Pontos insuficientes' });
    }

    // Verificar se já existe uma solicitação pendente
    const existingRequest = await prisma.rewardRequest.findFirst({
      where: {
        schoolId,
        rewardId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Já existe uma solicitação pendente para esta recompensa' });
    }

    // Criar solicitação
    const request = await prisma.rewardRequest.create({
      data: {
        schoolId,
        rewardId,
        status: 'PENDING',
      },
      include: {
        reward: true,
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Solicitação de recompensa criada com sucesso',
      request,
    });
  } catch (error: any) {
    console.error('Erro ao solicitar recompensa:', error);
    res.status(500).json({ message: 'Erro ao solicitar recompensa', error: error.message });
  }
};

export const getSchoolRewardRequests = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;

    const requests = await prisma.rewardRequest.findMany({
      where: { schoolId },
      include: {
        reward: true,
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.json(requests);
  } catch (error: any) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({ message: 'Erro ao buscar solicitações', error: error.message });
  }
};

export const getAllRewardRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const requests = await prisma.rewardRequest.findMany({
      where,
      include: {
        reward: true,
        school: {
          select: {
            id: true,
            name: true,
            points: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.json(requests);
  } catch (error: any) {
    console.error('Erro ao buscar solicitações:', error);
    res.status(500).json({ message: 'Erro ao buscar solicitações', error: error.message });
  }
};

export const approveRewardRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await prisma.rewardRequest.findUnique({
      where: { id },
      include: {
        reward: true,
        school: true,
      },
    });

    if (!request) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Solicitação já foi processada' });
    }

    // Verificar se a escola tem pontos suficientes
    if (request.school.points < request.reward.points) {
      return res.status(400).json({ message: 'Escola não tem pontos suficientes' });
    }

    // Atualizar solicitação
    const updatedRequest = await prisma.rewardRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      },
    });

    // Deduzir pontos da escola
    await prisma.school.update({
      where: { id: request.schoolId },
      data: {
        points: {
          decrement: request.reward.points,
        },
      },
    });

    res.json({
      message: 'Recompensa aprovada com sucesso',
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error('Erro ao aprovar recompensa:', error);
    res.status(500).json({ message: 'Erro ao aprovar recompensa', error: error.message });
  }
};

export const denyRewardRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await prisma.rewardRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ message: 'Solicitação não encontrada' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Solicitação já foi processada' });
    }

    // Atualizar solicitação
    const updatedRequest = await prisma.rewardRequest.update({
      where: { id },
      data: {
        status: 'DENIED',
        deniedAt: new Date(),
      },
    });

    res.json({
      message: 'Recompensa negada',
      request: updatedRequest,
    });
  } catch (error: any) {
    console.error('Erro ao negar recompensa:', error);
    res.status(500).json({ message: 'Erro ao negar recompensa', error: error.message });
  }
};

