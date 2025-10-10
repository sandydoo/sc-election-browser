import { db } from "$lib/server/db/index.js";
import { metadata } from "@sc-election/db/schema";

export async function load() {
  const [info] = await db.select().from(metadata).limit(1);

  return {
    lastUpdatedAt: info?.lastFetchedAt?.toISOString() || null,
  };
}
