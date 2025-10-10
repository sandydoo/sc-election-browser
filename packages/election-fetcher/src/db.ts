import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "@sc-election/db";
import { metadata, configureSqlite } from "@sc-election/db";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = createClient({
  url: DATABASE_URL,
});

await configureSqlite(client);

export const db = drizzle(client, { schema });

const migrationsFolder =
  process.env.MIGRATIONS_DIR || `${process.env.DEVENV_ROOT}/drizzle`;
await migrate(db, { migrationsFolder });

export async function updateLastFetchTime() {
  await db
    .insert(metadata)
    .values({
      id: 1,
      lastFetchedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: metadata.id,
      set: {
        lastFetchedAt: new Date(),
      },
    });
}
