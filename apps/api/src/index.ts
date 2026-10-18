import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { items, openDb } from "@vibe/db";
import { CreateItemSchema } from "@vibe/shared";

const app = new Hono();
const db = openDb();

/** Liveness probe. Time: O(1); Space: O(1). */
app.get("/health", (c) => c.json({ status: "ok" }));

/** List all items, newest last. Time: O(rows); Space: O(rows). */
app.get("/items", (c) => {
  const rows = db.select().from(items).all();
  return c.json(
    rows.map((r) => ({ id: r.id, name: r.name, createdAt: r.createdAt }))
  );
});

/** Create one item; validates the body with the shared Zod schema.
 * Time: O(name length); Space: O(name length). */
app.post("/items", async (c) => {
  const parsed = CreateItemSchema.safeParse(await c.req.json().catch(() => null));
  if (!parsed.success) {
    return c.json({ error: "invalid item" }, 400);
  }
  const createdAt = new Date().toISOString();
  const result = db
    .insert(items)
    .values({ name: parsed.data.name, createdAt })
    .returning()
    .get();
  return c.json(
    { id: result.id, name: result.name, createdAt: result.createdAt },
    201
  );
});

/** RPC type for the Next.js typed client. Time/space: O(1) type-level. */
export type AppType = typeof app;

/** API port; loopback bind is enforced below, never 0.0.0.0.
 * Time: O(1); Space: O(1). */
function apiPort(): number {
  const raw = Number(process.env.API_PORT ?? 4000);
  return Number.isInteger(raw) && raw > 0 && raw < 65536 ? raw : 4000;
}

const port = apiPort();
console.log(`vibe-api listening on 127.0.0.1:${port}`);
serve({ fetch: app.fetch, port, hostname: "127.0.0.1" });
