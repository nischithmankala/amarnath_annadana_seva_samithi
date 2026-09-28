import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function check() {
  const donations = await prisma.donation.findMany({
    include: { payment: true }
  });
  console.log(JSON.stringify(donations, null, 2));
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
