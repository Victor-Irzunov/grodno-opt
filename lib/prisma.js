// /lib/prisma.js
// Singleton Prisma для Next (чтобы не падало на hot-reload / dev)
import { PrismaClient } from '@prisma/client';

let prismaGlobal = globalThis.__prisma || null;

if (!prismaGlobal) {
  prismaGlobal = new PrismaClient();
  globalThis.__prisma = prismaGlobal;
}

const prisma = prismaGlobal;
export default prisma;
