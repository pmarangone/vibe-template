"use client";

import { useState } from "react";
import { Button, Card } from "@vibe/ui";
import type { Item } from "@vibe/shared";

/** Counter-style demo page: creates items through /api (Next rewrite -> Hono).
 * Time: O(items) render; Space: O(items) client state. */
export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("hello");
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    const res = await fetch("/api/items");
    if (!res.ok) {
      setError("failed to load items");
      return;
    }
    setItems(await res.json());
  }

  async function add() {
    setError("");
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setError("failed to create item");
      return;
    }
    await refresh();
  }

  return (
    <main className="mx-auto max-w-xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Vibe App</h1>
      <Card>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-slate-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button onClick={add}>Add item</Button>
          <Button variant="secondary" onClick={refresh}>
            Refresh
          </Button>
        </div>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        <ul className="mt-4 space-y-1">
          {items.map((item) => (
            <li key={item.id} className="text-sm">
              {item.id}: {item.name}
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
