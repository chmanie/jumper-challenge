import { Redis } from 'ioredis';

import { PrismaClient } from '$prisma/client';

import { env } from './utils/envConfig';

export const prismaClient = new PrismaClient();

export const redis = new Redis(env.REDIS_URL);
