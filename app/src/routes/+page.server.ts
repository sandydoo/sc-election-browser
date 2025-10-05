import { db } from "$lib/server/db/index.js";
import { candidates, questions } from "@sc-election/db/schema";
import { asc } from "drizzle-orm";

export async function load() {
  const allCandidates = await db.select().from(candidates).orderBy(asc(candidates.githubHandle));
  const allQuestions = await db.select().from(questions);

  return {
    candidates: allCandidates,
    questions: allQuestions,
  };
}
