import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN environment variable is required");
}

export const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

export const REPO_OWNER = "NixOS";
export const REPO_NAME = "SC-election-2025";
