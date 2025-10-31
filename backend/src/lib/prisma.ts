import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || new PrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  global.prisma = prisma;
}

// Middleware to hash password before saving
prisma.$use(async (params, next) => {
  if (params.model === 'User' && (params.action === 'create' || params.action === 'update')) {
    const user = params.args.data;
    if (user.password) {
      const hashedPassword = await hash(user.password, 10);
      params.args.data.password = hashedPassword;
    }
  }
  return next(params);
});

export default prisma;
