import { octokit, REPO_OWNER, REPO_NAME } from "../github.js";
import { db } from "../db.js";
import { questions, candidateResponses } from "@sc-election/db/schema";
import { inArray, notInArray } from "drizzle-orm";

export async function fetchQuestions() {
  console.log("Fetching questions from GitHub...");

  try {
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      labels: "question",
      state: "all",
      per_page: 100,
    });

    console.log(`Found ${issues.length} question issues`);

    const openQuestionNumbers: number[] = [];

    for (const issue of issues) {
      if (issue.state === "closed") {
        console.log(`Skipping closed issue #${issue.number}: ${issue.title}`);
        continue;
      }

      openQuestionNumbers.push(issue.number);

      console.log(`Processing issue #${issue.number}: ${issue.title}`);

      let body = issue.body || null;
      if (body) {
        body = body.replace(/^#+\s*Question\s*\n/i, "");
      }

      await db
        .insert(questions)
        .values({
          issueNumber: issue.number,
          issueId: issue.id,
          title: issue.title,
          body,
          askerHandle: issue.user?.login || null,
        })
        .onConflictDoUpdate({
          target: questions.issueNumber,
          set: {
            title: issue.title,
            body,
            askerHandle: issue.user?.login || null,
          },
        });

      console.log(`✓ Saved question #${issue.number}`);
    }

    if (openQuestionNumbers.length > 0) {
      const questionsToDelete = await db
        .select()
        .from(questions)
        .where(notInArray(questions.issueNumber, openQuestionNumbers));

      if (questionsToDelete.length > 0) {
        console.log(
          `\n✗ Deleting ${questionsToDelete.length} questions (closed or removed)`,
        );

        const questionIds = questionsToDelete.map((q) => q.id);

        await db
          .delete(candidateResponses)
          .where(inArray(candidateResponses.questionId, questionIds));

        await db
          .delete(questions)
          .where(notInArray(questions.issueNumber, openQuestionNumbers));
      }
    }

    console.log(`\nSuccessfully processed ${issues.length} questions`);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}
