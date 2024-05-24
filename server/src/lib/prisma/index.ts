import { PrismaClient, Prisma } from '@prisma/client'

export type Coins = Prisma.CoinsGetPayload<{include: { image: true }}>

export default new PrismaClient({log: ['query', 'info', 'warn', 'error'],})