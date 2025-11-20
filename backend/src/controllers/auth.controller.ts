import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { geocodeAddress } from '../services/geolocation.service';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      cpf,
      phone,
      address,
      neighborhood,
      city,
      bolsaFamilia,
      hasBolsaFamilia,
    } = req.body;

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verificar se CPF já existe
    if (cpf) {
      const existingCPF = await prisma.user.findUnique({ where: { cpf } });
      if (existingCPF) {
        return res.status(400).json({ message: 'CPF já cadastrado' });
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    const fullAddress = [address, neighborhood, city]
      .filter(Boolean)
      .join(', ');
    const geocode = fullAddress ? await geocodeAddress(fullAddress) : null;

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cpf,
        phone,
        address,
        neighborhood,
        city,
        bolsaFamilia,
        hasBolsaFamilia: hasBolsaFamilia || false,
        lat: geocode?.lat,
        lng: geocode?.lng,
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
        createdAt: true,
      },
    });

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      type: 'USER',
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user,
      token,
    });
  } catch (error: any) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
};

export const registerSchool = async (req: Request, res: Response) => {
  try {
    const {
      schoolName,
      cnpj,
      email,
      password,
      address,
      neighborhood,
      city,
      responsibleName,
      responsiblePhone,
      responsibleEmail,
      storageCapacity,
    } = req.body;

    // Verificar se email já existe
    const existingSchool = await prisma.school.findUnique({ where: { email } });
    if (existingSchool) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Verificar se CNPJ já existe
    const existingCNPJ = await prisma.school.findUnique({ where: { cnpj } });
    if (existingCNPJ) {
      return res.status(400).json({ message: 'CNPJ já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    const fullAddress = [address, neighborhood, city]
      .filter(Boolean)
      .join(', ');
    const geocode = fullAddress ? await geocodeAddress(fullAddress) : null;

    // Criar escola
    const school = await prisma.school.create({
      data: {
        name: schoolName,
        cnpj,
        email,
        password: hashedPassword,
        address,
        neighborhood,
        city,
        responsibleName,
        responsiblePhone,
        responsibleEmail,
        storageCapacity,
        lat: geocode?.lat,
        lng: geocode?.lng,
        neighborhood: geocode?.neighborhood || neighborhood,
        city: geocode?.city || city,
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
        createdAt: true,
      },
    });

    // Gerar token
    const token = generateToken({
      id: school.id,
      email: school.email,
      type: 'SCHOOL',
    });

    res.status(201).json({
      message: 'Escola cadastrada com sucesso',
      school,
      token,
    });
  } catch (error: any) {
    console.error('Erro ao registrar escola:', error);
    res.status(500).json({ message: 'Erro ao criar escola', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'Email, senha e tipo de usuário são obrigatórios' });
    }

    let user: any = null;
    let type: 'USER' | 'SCHOOL' | 'GOVERNMENT' = 'USER';

    // Buscar usuário baseado no tipo
    if (userType === 'user') {
      user = await prisma.user.findUnique({ where: { email } });
      type = 'USER';
    } else if (userType === 'school') {
      user = await prisma.school.findUnique({ where: { email } });
      type = 'SCHOOL';
    } else if (userType === 'government') {
      user = await prisma.government.findUnique({ where: { email } });
      type = 'GOVERNMENT';
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      type,
    });

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token,
      type,
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const { user } = req;

    let userData: any = null;

    if (user.type === 'USER') {
      userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          cpf: true,
          phone: true,
          address: true,
          neighborhood: true,
          city: true,
          bolsaFamilia: true,
          hasBolsaFamilia: true,
          totalLiters: true,
          rewardsEarned: true,
          co2Saved: true,
          level: true,
          createdAt: true,
        },
      });
    } else if (user.type === 'SCHOOL') {
      userData = await prisma.school.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          cnpj: true,
          address: true,
          neighborhood: true,
          city: true,
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
    } else if (user.type === 'GOVERNMENT') {
      userData = await prisma.government.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });
    }

    if (!userData) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ user: userData, type: user.type });
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};

