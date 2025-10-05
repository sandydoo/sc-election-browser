import { octokit, REPO_OWNER, REPO_NAME } from "../github.js";
import { db } from "../db.js";
import { candidates } from "@sc-election/db/schema";
import { parseCandidateMarkdown } from "../parsers/candidate.js";

export async function fetchCandidates() {
  console.log("Fetching candidates from GitHub...");

  try {
    const { data: contents } = await octokit.rest.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: "candidates",
    });

    if (!Array.isArray(contents)) {
      throw new Error(
        "Expected candidates directory to contain multiple files",
      );
    }

    const candidateFiles = contents.filter(
      (file) => file.type === "file" && file.name.endsWith(".md"),
    );

    console.log(`Found ${candidateFiles.length} candidate files`);

    for (const file of candidateFiles) {
      console.log(`Processing ${file.name}...`);

      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: file.path,
      });

      if (!("content" in fileData)) {
        console.warn(`Skipping ${file.name}: not a file`);
        continue;
      }

      const content = Buffer.from(fileData.content, "base64").toString("utf-8");

      try {
        const parsed = parseCandidateMarkdown(content, file.name);

        await db
          .insert(candidates)
          .values({
            githubHandle: parsed.metadata.githubHandle,
            name: parsed.metadata.name,
            email: parsed.metadata.email,
            discourseHandle: parsed.metadata.discourseHandle || null,
            matrixHandle: parsed.metadata.matrixHandle || null,
            conflictOfInterest: parsed.conflictOfInterest || null,
            motivation: parsed.motivation || null,
            personalStatement: parsed.fullStatement,
          })
          .onConflictDoUpdate({
            target: candidates.githubHandle,
            set: {
              name: parsed.metadata.name,
              email: parsed.metadata.email,
              discourseHandle: parsed.metadata.discourseHandle || null,
              matrixHandle: parsed.metadata.matrixHandle || null,
              conflictOfInterest: parsed.conflictOfInterest || null,
              motivation: parsed.motivation || null,
              personalStatement: parsed.fullStatement,
              updatedAt: new Date(),
            },
          });

        console.log(
          `✓ Saved candidate: ${parsed.metadata.name} (@${parsed.metadata.githubHandle})`,
        );
      } catch (error) {
        console.error(`Error parsing ${file.name}:`, error);
      }
    }

    console.log(`\nSuccessfully processed ${candidateFiles.length} candidates`);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
}
