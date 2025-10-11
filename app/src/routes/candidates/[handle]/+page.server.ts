import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { candidates, candidateResponses, questions } from "@sc-election/db";
import { eq, sql, asc } from "drizzle-orm";

export async function load({ params }) {
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
        issueNumber: questions.issueNumber,
        title: questions.title,
        body: questions.body,
      },
    })
    .from(candidateResponses)
    .innerJoin(questions, eq(candidateResponses.questionId, questions.id))
    .where(eq(candidateResponses.candidateId, candidate.id));

  const allCandidates = await db
    .select({ githubHandle: candidates.githubHandle })
    .from(candidates)
    .orderBy(asc(sql`lower(${candidates.githubHandle})`));

  return {
    candidate,
    responses,
    allCandidates,
  };
}
