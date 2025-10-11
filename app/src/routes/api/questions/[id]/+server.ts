import { json, error } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import { questions, candidateResponses, candidates } from "@sc-election/db";
import { eq } from "drizzle-orm";

export async function GET({ params }) {
  const issueNumber = parseInt(params.id);

  if (isNaN(issueNumber)) {
    throw error(400, "Invalid question ID");
  }

  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.issueNumber, issueNumber))
    .limit(1);

  if (!question) {
    throw error(404, "Question not found");
  }

  const responses = await db
    .select({
      id: candidateResponses.id,
      response: candidateResponses.response,
      commentId: candidateResponses.commentId,
      createdAt: candidateResponses.createdAt,
      candidate: {
        id: candidates.id,
        githubHandle: candidates.githubHandle,
        name: candidates.name,
      },
    })
    .from(candidateResponses)
    .innerJoin(candidates, eq(candidateResponses.candidateId, candidates.id))
    .where(eq(candidateResponses.questionId, question.id));

  return json({
    ...question,
    responses,
  });
}
