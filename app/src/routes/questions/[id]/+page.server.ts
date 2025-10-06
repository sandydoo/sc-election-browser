import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db/index.js";
import {
  questions,
  candidateResponses,
  candidates,
} from "@sc-election/db/schema";
import { eq, asc } from "drizzle-orm";

export async function load({ params }) {
  const questionId = parseInt(params.id);

  if (isNaN(questionId)) {
    throw error(400, "Invalid question ID");
  }

  const [question] = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId))
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
    .where(eq(candidateResponses.questionId, questionId));

  const allQuestions = await db
    .select({ id: questions.id })
    .from(questions)
    .orderBy(asc(questions.id));

  return {
    question,
    responses,
    allQuestions,
  };
}
