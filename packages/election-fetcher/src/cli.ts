import { Command } from "commander";
import { fetchCandidates } from "./fetchers/candidates.js";
import { fetchQuestions } from "./fetchers/questions.js";
import { fetchResponses } from "./fetchers/responses.js";
import { fetchEndorsements } from "./fetchers/endorsements.js";

const program = new Command();

program
  .name("election-fetcher")
  .description("CLI tool to fetch NixOS SC election data from GitHub")
  .version("0.0.1");

program
  .command("fetch-candidates")
  .description("Fetch candidate data from the GitHub repository")
  .action(async () => {
    try {
      await fetchCandidates();
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      process.exit(1);
    }
  });

program
  .command("fetch-questions")
  .description("Fetch question issues from the GitHub repository")
  .action(async () => {
    try {
      await fetchQuestions();
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      process.exit(1);
    }
  });

program
  .command("fetch-responses")
  .description("Fetch candidate responses to questions")
  .action(async () => {
    try {
      await fetchResponses();
    } catch (error) {
      console.error("Failed to fetch responses:", error);
      process.exit(1);
    }
  });

program
  .command("fetch-endorsements")
  .description("Fetch endorsements from nomination PRs")
  .action(async () => {
    try {
      await fetchEndorsements();
    } catch (error) {
      console.error("Failed to fetch endorsements:", error);
      process.exit(1);
    }
  });

program
  .command("fetch-all")
  .description("Fetch all election data (candidates, questions, responses)")
  .action(async () => {
    try {
      console.log("Fetching all election data...\n");
      await fetchCandidates();
      console.log("");
      await fetchQuestions();
      console.log("");
      await fetchResponses();
      console.log("");
      await fetchEndorsements();
      console.log("\n✓ All data fetched successfully");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      process.exit(1);
    }
  });

program.parse();
