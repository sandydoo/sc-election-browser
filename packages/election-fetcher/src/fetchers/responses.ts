import { octokit, REPO_OWNER, REPO_NAME } from "../github.js";
import { db } from "../db.js";
import {
  questions,
  candidates,
  candidateResponses,
} from "@sc-election/db/schema";
import { notInArray } from "drizzle-orm";

export async function fetchResponses() {
  console.log("Fetching candidate responses from GitHub...");

  try {
    // Get all questions from the database
    const allQuestions = await db.select().from(questions);
    console.log(
      `Found ${allQuestions.length} questions to check for responses`,
    );

    // Get all candidates from the database
    const allCandidates = await db.select().from(candidates);
    const candidatesByHandle = new Map(
      allCandidates.map((c) => [c.githubHandle.toLowerCase(), c]),
    );

    let totalResponses = 0;
    const validCommentIds: number[] = [];

    for (const question of allQuestions) {
      console.log(
        `\nChecking responses for question #${question.issueNumber}...`,
      );

      // Fetch all comments on this issue
      const { data: comments } = await octokit.rest.issues.listComments({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: question.issueNumber,
        per_page: 100,
      });

      for (const comment of comments) {
        const commenterHandle = comment.user?.login.toLowerCase();
        if (!commenterHandle) continue;

        // Check if this commenter is a candidate
        const candidate = candidatesByHandle.get(commenterHandle);
        if (!candidate) continue;

        console.log(
          `  Found response from candidate @${candidate.githubHandle}`,
        );

        validCommentIds.push(comment.id);

        await db
          .insert(candidateResponses)
          .values({
            questionId: question.id,
            candidateId: candidate.id,
            response: comment.body || null,
            commentId: comment.id,
          })
          .onConflictDoUpdate({
            target: candidateResponses.commentId,
            set: {
              response: comment.body || null,
            },
          });

        totalResponses++;
      }
    }

    if (validCommentIds.length > 0) {
      const responsesToDelete = await db
        .select()
        .from(candidateResponses)
        .where(notInArray(candidateResponses.commentId, validCommentIds));

      if (responsesToDelete.length > 0) {
        console.log(
          `\n✗ Deleting ${responsesToDelete.length} responses (comments removed)`,
        );

        await db
          .delete(candidateResponses)
          .where(notInArray(candidateResponses.commentId, validCommentIds));
      }
    }

    console.log(
      `\n✓ Successfully processed ${totalResponses} candidate responses`,
    );
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
}
