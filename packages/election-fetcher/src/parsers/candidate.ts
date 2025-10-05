import matter from "gray-matter";

export interface CandidateMetadata {
  name: string;
  githubHandle: string;
  email: string;
  discourseHandle?: string;
  matrixHandle?: string;
}

export interface ParsedCandidate {
  metadata: CandidateMetadata;
  conflictOfInterest: string;
  motivation: string;
  whatIWillDo: string;
  whatIHaveDone: string;
  fullStatement: string;
}

export function parseCandidateMarkdown(
  content: string,
  filename: string,
): ParsedCandidate {
  const { data, content: markdownContent } = matter(content);

  const lines = markdownContent.trim().split("\n");
  const metadata: Partial<CandidateMetadata> = {};
  let i = 0;

  // Skip any initial headings or empty lines
  while (
    i < lines.length &&
    (lines[i].trim().startsWith("#") || lines[i].trim() === "")
  ) {
    i++;
  }

  while (
    i < lines.length &&
    (lines[i].trim().startsWith("-") || lines[i].trim().startsWith("*"))
  ) {
    const line = lines[i].trim();
    const match = line.match(/^[-*]\s*([^:]+):\s*(.+)$/);

    if (match) {
      const [, key, value] = match;
      let cleanValue = value.trim();

      // Extract text from markdown links [text](url) or just remove @ prefix
      const linkMatch = cleanValue.match(/\[([^\]]+)\]/);
      if (linkMatch) {
        cleanValue = linkMatch[1].replace(/^@/, "");
      } else {
        cleanValue = cleanValue.replace(/^@/, "");
      }

      // Remove backticks
      cleanValue = cleanValue.replace(/`/g, "");

      const keyLower = key.trim().toLowerCase();

      if (keyLower === "name") {
        metadata.name = cleanValue;
      } else if (keyLower.includes("github")) {
        metadata.githubHandle = cleanValue;
      } else if (keyLower.includes("email")) {
        // Extract just the email address using regex
        const emailMatch = cleanValue.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
        metadata.email = emailMatch ? emailMatch[0] : cleanValue;
      } else if (keyLower.includes("discourse")) {
        if (cleanValue) metadata.discourseHandle = cleanValue;
      } else if (keyLower.includes("matrix")) {
        if (cleanValue) metadata.matrixHandle = cleanValue;
      }
    }
    i++;
  }

  if (!metadata.name || !metadata.githubHandle || !metadata.email) {
    throw new Error(`Missing required metadata in ${filename}`);
  }

  const sections = markdownContent.split(/(?=^#{1,3}\s)/m);

  let conflictOfInterest = "";
  let motivation = "";
  let whatIWillDo = "";
  let whatIHaveDone = "";

  for (const section of sections) {
    if (
      /^#{1,3}\s+Conflict of interest/i.test(section) ||
      /^Conflict of interest/i.test(section)
    ) {
      conflictOfInterest = section
        .replace(/^#{0,3}\s*Conflict of interest[^\n]*\n+/i, "")
        .trim();
    } else if (
      /^#{1,3}\s+Motivation/i.test(section) ||
      /^Motivation/i.test(section)
    ) {
      motivation = section.replace(/^#{0,3}\s*Motivation[^\n]*\n+/i, "").trim();
    } else if (/^#{1,3}\s+What I (will|would) do/i.test(section)) {
      whatIWillDo = section
        .replace(/^#{0,3}\s*What I (will|would) do[^\n]*\n+/i, "")
        .trim();
    } else if (/^#{1,3}\s+What I have done/i.test(section)) {
      whatIHaveDone = section
        .replace(/^#{0,3}\s*What I have done[^\n]*\n+/i, "")
        .trim();
    }
  }

  return {
    metadata: metadata as CandidateMetadata,
    conflictOfInterest,
    motivation,
    whatIWillDo,
    whatIHaveDone,
    fullStatement: markdownContent,
  };
}
