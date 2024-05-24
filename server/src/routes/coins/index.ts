import { router, publicProcedure } from "../../lib/trpc"
import db from '../../lib/prisma'
import { z } from "zod"

const insertSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    value: z.number(),
    rarity: z.string(),
    year: z.number()
})

export const coinsRouter = router({
    get: publicProcedure.query(async () => {
        return db.coins.findMany({ include: { image: true }});
    }),
    getById: publicProcedure.input(z.number()).query(async ({ input: id }) => {
        return db.coins.findFirst({ include: { image: true }, where: {id}});
    }),
    create: publicProcedure.input(insertSchema).mutation(async ({ input: { rarity, ...rest } }) => {
        const r = rarity
        return await db.coins.create({ data: { rariry: r, ...rest } })
    })
})
  
export type CoinsRouter = typeof coinsRouter