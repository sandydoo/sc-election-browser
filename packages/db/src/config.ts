import type { Client } from "@libsql/client";

export async function configureSqlite(client: Client) {
  await client.execute("PRAGMA journal_mode = WAL");
  await client.execute("PRAGMA busy_timeout = 5000");
  await client.execute("PRAGMA foreign_keys = ON");
  await client.execute("PRAGMA synchronous = NORMAL");
  await client.execute("PRAGMA mmap_size = 134217728");
  await client.execute("PRAGMA journal_size_limit = 27103364");
  await client.execute("PRAGMA cache_size = 2000");
}
