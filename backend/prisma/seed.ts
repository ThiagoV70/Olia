import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Criar usuário governo
  const government = await prisma.government.upsert({
    where: { email: 'governo@olia.com' },
    update: {},
    create: {
      name: 'Governo Municipal',
      email: 'governo@olia.com',
      password: await bcrypt.hash('admin123', 10),
    },
  });

  console.log('✅ Governo criado:', government.email);

  // Criar recompensas
  const rewards = [
    {
      name: 'Computadores Novos',
      description: '5 computadores para laboratório de informática',
      points: 5000,
      image: '💻',
    },
    {
      name: 'Ventiladores',
      description: '10 ventiladores para salas de aula',
      points: 3000,
      image: '🌀',
    },
    {
      name: 'Material de Laboratório',
      description: 'Kit completo de ciências',
      points: 7000,
      image: '🔬',
    },
    {
      name: 'Livros Didáticos',
      description: '100 livros para biblioteca',
      points: 4000,
      image: '📚',
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.upsert({
      where: { name: reward.name },
      update: {},
      create: reward,
    });
  }

  console.log('✅ Recompensas criadas');

  // Criar locais de retirada
  const pickupLocations = [
    {
      name: 'Farmácia Popular Centro',
      address: 'Av. Central, 100',
      date: new Date('2025-10-15'),
      startTime: '09:00',
      endTime: '16:00',
      available: true,
    },
    {
      name: 'Farmácia Popular Jardim',
      address: 'Rua do Jardim, 250',
      date: new Date('2025-10-16'),
      startTime: '08:00',
      endTime: '17:00',
      available: true,
    },
  ];

  for (const location of pickupLocations) {
    await prisma.pickupLocation.upsert({
      where: { name: location.name },
      update: {},
      create: location,
    });
  }

  console.log('✅ Locais de retirada criados');

  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

