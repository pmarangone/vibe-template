import { z } from "zod";

/** Item creation payload. Time: O(name length); Space: O(name length). */
export const CreateItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
});

export type CreateItem = z.infer<typeof CreateItemSchema>;

/** Stored item row. Time: O(1); Space: O(name length). */
export const ItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  createdAt: z.string(),
});

export type Item = z.infer<typeof ItemSchema>;
