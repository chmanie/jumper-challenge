import { prismaClient } from '@/common/prisma';

export async function clearTestDatabase() {
  await prismaClient.token.deleteMany();
  await prismaClient.user.deleteMany();
}
