import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Items table. One row per created item. Time/space: O(1) schema. */
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
});
