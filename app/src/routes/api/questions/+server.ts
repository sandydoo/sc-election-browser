import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { questions } from "@sc-election/db/schema";

export async function GET() {
  const allQuestions = await db.select().from(questions);

  return json(allQuestions);
}
