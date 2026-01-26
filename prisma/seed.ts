import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

async function main() {
  console.log('🌱 Seeding database...');
  console.log('📦 Using database: edtech_user');

  // Create demo user
  const demoPassword = await hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { studentId: 'student001' },
    update: {},
    create: {
      studentId: 'student001',
      name: 'Demo Student',
      class: '5',
      passwordHash: demoPassword,
    },
  });

  console.log('✅ Demo user created:', demoUser.studentId);
  console.log('📋 Table: student_info');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

