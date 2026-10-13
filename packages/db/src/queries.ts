import { sql } from "drizzle-orm";
import { candidates } from "./schema.js";

/** Match a candidate by GitHub handle. GitHub handles are case-insensitive. */
export function candidateHandleIs(handle: string) {
  return sql`lower(${candidates.githubHandle}) = ${handle.toLowerCase()}`;
}
