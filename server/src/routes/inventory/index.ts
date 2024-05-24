import { router, publicProcedure } from "../../lib/trpc"
import db from '@/lib/prisma'
import { z } from "zod"

export const inventoryRouter = router({
    get: publicProcedure.query(async () => {
        return db.inventory.findMany();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input: { id }}) => {
        return db.inventory.findFirst({where: {id}});
    })
})
  
export type InventoryRouter = typeof inventoryRouter