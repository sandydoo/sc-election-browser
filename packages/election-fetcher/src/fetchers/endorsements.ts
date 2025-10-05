import { octokit, REPO_OWNER, REPO_NAME } from "../github.js";
import { db } from "../db.js";
import { candidates } from "@sc-election/db/schema";
import { eq } from "drizzle-orm";

export async function fetchEndorsements() {
  console.log("Fetching endorsements from nomination PRs...");

  try {
    let allPRs = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data: prs } = await octokit.rest.pulls.list({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        state: "all",
        per_page: 100,
        page,
      });

      allPRs.push(...prs);
      hasMore = prs.length === 100;
      page++;
    }

    const nominationPRs = allPRs.filter(
      (pr) =>
        /^Nominate\s+/i.test(pr.title) &&
        pr.labels.some(
          (label) =>
            label.name === "nomination" ||
            label.name === "accepted-and-endorsed",
        ),
    );

    console.log(`Found ${nominationPRs.length} nomination PRs`);

    for (const pr of nominationPRs) {
      console.log(`Processing PR #${pr.number}: ${pr.title}`);

      const nomineeHandle = pr.title
        .replace(/^Nominate\s+/i, "")
        .trim()
        .replace(/^@/, "")
        .replace(/^`|`$/g, "");
      const nominatedBy = pr.user?.login.replace(/^@/, "");

      if (!nominatedBy) {
        console.warn(`Skipping PR #${pr.number}: no user found`);
        continue;
      }

      const { data: comments } = await octokit.rest.issues.listComments({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        issue_number: pr.number,
      });

      const endorsers = comments
        .filter(
          (comment) =>
            comment.body &&
            /!endorse\b/i.test(comment.body) &&
            comment.user &&
            comment.user.type !== "Bot",
        )
        .map((comment) => comment.user!.login.replace(/^@/, ""));

      const uniqueEndorsers = [...new Set(endorsers)];

      console.log(
        `  Found ${uniqueEndorsers.length} endorsers for @${nomineeHandle}`,
      );

      const [candidate] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.githubHandle, nomineeHandle))
        .limit(1);

      if (candidate) {
        await db
          .update(candidates)
          .set({
            nominatedBy,
            endorsers: uniqueEndorsers,
            updatedAt: new Date(),
          })
          .where(eq(candidates.id, candidate.id));

        console.log(`  ✓ Updated candidate: @${nomineeHandle}`);
      } else {
        console.warn(
          `  ! Candidate not found in database: @${nomineeHandle}. Skipping.`,
        );
      }
    }

    console.log(`\nSuccessfully processed ${nominationPRs.length} PRs`);
  } catch (error) {
    console.error("Error fetching endorsements:", error);
    throw error;
  }
}
