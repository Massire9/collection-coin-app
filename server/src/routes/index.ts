import { router } from "../lib/trpc"
import { coinsRouter } from "./coins"
import { inventoryRouter } from "./inventory"

export const appRouter = router({
  coins: coinsRouter

})
  
export type AppRouter = typeof appRouter