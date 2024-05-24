import { appRouter, type AppRouter } from "./src/routes";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import db from "./src/lib/prisma"
import { writeFile } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({}),
  })
);

app.post('/api/image/add/:id', async (c) => {
  const { id } = c.req.param()
  const body = await c.req.parseBody()
  const image = body['file'] as File
  const buffer = await image.arrayBuffer()
  const filename = randomUUID() + '.png'
  if(image) {
    writeFile(path.join(__dirname, 'static', filename), Buffer.from(buffer), () => {})
  }
  await db.image.create({ data: { coin_id: parseInt(id), path: filename }})

})

export default app;
