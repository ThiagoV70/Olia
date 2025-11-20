import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { geocodeAddress } from '../services/geolocation.service';

const prisma = new PrismaClient();

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

  const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        neighborhood: true,
        city: true,
      lat: true,
      lng: true,
        bolsaFamilia: true,
        hasBolsaFamilia: true,
        totalLiters: true,
        rewardsEarned: true,
        co2Saved: true,
        level: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const existing = await prisma.user.findUnique({ where: { id: userId } });

    if (!existing) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const {
      name,
      phone,
      address,
      neighborhood,
      city,
      bolsaFamilia,
      hasBolsaFamilia,
    } = req.body;

    const resolvedAddress = {
      address: address ?? existing.address,
      neighborhood: neighborhood ?? existing.neighborhood,
      city: city ?? existing.city,
    };

    let geocode = null;
    if (
      (address !== undefined || neighborhood !== undefined || city !== undefined) &&
      resolvedAddress.address
    ) {
      const fullAddress = [resolvedAddress.address, resolvedAddress.neighborhood, resolvedAddress.city]
        .filter(Boolean)
        .join(', ');
      geocode = await geocodeAddress(fullAddress);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(neighborhood && { neighborhood }),
        ...(city && { city }),
        ...(bolsaFamilia !== undefined && { bolsaFamilia }),
        ...(hasBolsaFamilia !== undefined && { hasBolsaFamilia }),
        ...(geocode && {
          lat: geocode.lat,
          lng: geocode.lng,
          neighborhood: geocode.neighborhood || resolvedAddress.neighborhood,
          city: geocode.city || resolvedAddress.city,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone: true,
        address: true,
        neighborhood: true,
        city: true,
        lat: true,
        lng: true,
        bolsaFamilia: true,
        hasBolsaFamilia: true,
        totalLiters: true,
        rewardsEarned: true,
        co2Saved: true,
        level: true,
        updatedAt: true,
      },
    });

    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalLiters: true,
        rewardsEarned: true,
        co2Saved: true,
        level: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Calcular próxima recompensa (a cada 15L)
    const nextReward = Math.ceil(user.totalLiters / 15) * 15;
    const progress = (user.totalLiters / nextReward) * 100;

    res.json({
      ...user,
      nextReward,
      progress: Math.min(progress, 100),
    });
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: error.message });
  }
};

