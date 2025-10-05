import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { candidates, candidateResponses, questions } from "@sc-election/db/schema";
import { eq } from "drizzle-orm";

export async function GET({ params }) {
  const { handle } = params;

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.githubHandle, handle))
    .limit(1);

  if (!candidate) {
    throw error(404, "Candidate not found");
  }

  const responses = await db
    .select({
      id: candidateResponses.id,
      response: candidateResponses.response,
      commentId: candidateResponses.commentId,
      createdAt: candidateResponses.createdAt,
      question: {
        id: questions.id,
        issueNumber: questions.issueNumber,
        title: questions.title,
        body: questions.body,
      },
    })
    .from(candidateResponses)
    .innerJoin(questions, eq(candidateResponses.questionId, questions.id))
    .where(eq(candidateResponses.candidateId, candidate.id));

  return json({
    ...candidate,
    responses,
  });
}
