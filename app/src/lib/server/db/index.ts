import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import * as schema from "@sc-election/db";
import { configureSqlite } from "@sc-election/db";
import { env } from "$env/dynamic/private";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = createClient({ url: env.DATABASE_URL });

await configureSqlite(client);

export const db = drizzle(client, { schema });

const migrationsFolder = env.MIGRATIONS_DIR || `${env.DEVENV_ROOT}/drizzle`;
await migrate(db, { migrationsFolder });
