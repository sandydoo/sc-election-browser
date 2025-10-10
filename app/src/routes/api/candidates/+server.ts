import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { candidates } from "@sc-election/db";

export async function GET() {
  const allCandidates = await db.select().from(candidates);

  return json(allCandidates);
}
