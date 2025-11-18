import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateQRCode, generateDonationCode } from '../utils/qrcode.util';

const prisma = new PrismaClient();

export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { schoolId, liters } = req.body;

    if (!schoolId || !liters) {
      return res.status(400).json({ message: 'Escola e quantidade são obrigatórios' });
    }

    // Verificar se a escola existe
    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      return res.status(404).json({ message: 'Escola não encontrada' });
    }

    // Gerar código único
    const code = generateDonationCode();
    const qrCode = generateQRCode('donation', code);

    // Criar doação
    const donation = await prisma.donation.create({
      data: {
        userId,
        schoolId,
        liters: parseFloat(liters),
        code,
        qrCode,
        status: 'PENDING',
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            neighborhood: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Doação registrada com sucesso',
      donation,
    });
  } catch (error: any) {
    console.error('Erro ao criar doação:', error);
    res.status(500).json({ message: 'Erro ao criar doação', error: error.message });
  }
};

export const getUserDonations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const donations = await prisma.donation.findMany({
      where: { userId },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            address: true,
            neighborhood: true,
          },
        },
      },
      orderBy: { donatedAt: 'desc' },
    });

    res.json(donations);
  } catch (error: any) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ message: 'Erro ao buscar doações', error: error.message });
  }
};

export const getSchoolDonations = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;

    const donations = await prisma.donation.findMany({
      where: { schoolId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { donatedAt: 'desc' },
    });

    res.json(donations);
  } catch (error: any) {
    console.error('Erro ao buscar doações da escola:', error);
    res.status(500).json({ message: 'Erro ao buscar doações', error: error.message });
  }
};

export const confirmDonation = async (req: AuthRequest, res: Response) => {
  try {
    const schoolId = req.user!.id;
    const { id } = req.params;

    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!donation) {
      return res.status(404).json({ message: 'Doação não encontrada' });
    }

    if (donation.schoolId !== schoolId) {
      return res.status(403).json({ message: 'Você não tem permissão para confirmar esta doação' });
    }

    if (donation.status === 'CONFIRMED') {
      return res.status(400).json({ message: 'Doação já confirmada' });
    }

    // Atualizar doação
    const updatedDonation = await prisma.donation.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
    });

    // Atualizar estatísticas do usuário
    await prisma.user.update({
      where: { id: donation.userId },
      data: {
        totalLiters: {
          increment: donation.liters,
        },
        co2Saved: {
          increment: donation.liters * 2, // Aproximadamente 2kg de CO2 por litro
        },
      },
    });

    // Atualizar estatísticas da escola
    await prisma.school.update({
      where: { id: schoolId },
      data: {
        totalLiters: {
          increment: donation.liters,
        },
        capacity: {
          increment: Math.round((donation.liters / 100) * 100), // Aumentar capacidade baseado no volume
        },
      },
    });

    res.json({
      message: 'Doação confirmada com sucesso',
      donation: updatedDonation,
    });
  } catch (error: any) {
    console.error('Erro ao confirmar doação:', error);
    res.status(500).json({ message: 'Erro ao confirmar doação', error: error.message });
  }
};

