import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateQRCode } from '../utils/qrcode.util';

const prisma = new PrismaClient();

export const getPickupLocations = async (req: AuthRequest, res: Response) => {
  try {
    const locations = await prisma.pickupLocation.findMany({
      where: {
        available: true,
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
    });

    res.json(locations);
  } catch (error: any) {
    console.error('Erro ao buscar locais de retirada:', error);
    res.status(500).json({ message: 'Erro ao buscar locais de retirada', error: error.message });
  }
};

export const requestPickup = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { pickupLocationId } = req.body;

    if (!pickupLocationId) {
      return res.status(400).json({ message: 'Local de retirada é obrigatório' });
    }

    // Verificar se o usuário é elegível (tem Bolsa Família)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hasBolsaFamilia) {
      return res.status(403).json({ message: 'Apenas beneficiários do Bolsa Família podem retirar sabão' });
    }

    // Verificar se o local existe e está disponível
    const location = await prisma.pickupLocation.findUnique({
      where: { id: pickupLocationId },
    });

    if (!location || !location.available) {
      return res.status(404).json({ message: 'Local de retirada não disponível' });
    }

    // Verificar se o usuário já tem uma retirada pendente
    const existingPickup = await prisma.pickup.findFirst({
      where: {
        userId,
        pickupLocationId,
        pickedUpAt: null,
      },
    });

    if (existingPickup) {
      return res.status(400).json({ message: 'Você já tem uma retirada agendada neste local' });
    }

    // Gerar QR Code
    const qrCode = generateQRCode('pickup', userId);

    // Criar retirada
    const pickup = await prisma.pickup.create({
      data: {
        userId,
        pickupLocationId,
        qrCode,
      },
      include: {
        pickupLocation: true,
      },
    });

    res.status(201).json({
      message: 'Retirada confirmada com sucesso',
      pickup,
    });
  } catch (error: any) {
    console.error('Erro ao solicitar retirada:', error);
    res.status(500).json({ message: 'Erro ao solicitar retirada', error: error.message });
  }
};

export const getUserPickups = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const pickups = await prisma.pickup.findMany({
      where: { userId },
      include: {
        pickupLocation: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(pickups);
  } catch (error: any) {
    console.error('Erro ao buscar retiradas:', error);
    res.status(500).json({ message: 'Erro ao buscar retiradas', error: error.message });
  }
};

export const getAllPickups = async (req: AuthRequest, res: Response) => {
  try {
    const pickups = await prisma.pickup.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            bolsaFamilia: true,
          },
        },
        pickupLocation: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(pickups);
  } catch (error: any) {
    console.error('Erro ao buscar retiradas:', error);
    res.status(500).json({ message: 'Erro ao buscar retiradas', error: error.message });
  }
};

