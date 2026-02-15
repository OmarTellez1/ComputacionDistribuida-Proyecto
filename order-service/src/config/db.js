import { PrismaClient } from '@prisma/client';

// Instanciamos Prisma.
// El log: ['query'] es opcional, sirve para ver en consola el SQL que Prisma genera (muy útil para depurar).
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;