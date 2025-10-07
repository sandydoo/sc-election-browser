import { octokit, REPO_OWNER, REPO_NAME } from "../github.js";
import { db } from "../db.js";
import { questions } from "@sc-election/db/schema";

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

    for (const issue of issues) {
      if (issue.state === "closed") {
        console.log(`Skipping closed issue #${issue.number}: ${issue.title}`);
        continue;
      }

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

    console.log(`\nSuccessfully processed ${issues.length} questions`);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}
