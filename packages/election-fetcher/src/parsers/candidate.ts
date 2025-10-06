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
}

function normalizeContent(text: string): string {
  return text
    .replace(/^#\s+/gm, "## ") // Normalize single # to ##
    .replace(/^[-*_]{3,}\s*$/gm, "") // Remove horizontal rules
    .replace(/\n{3,}/g, "\n\n") // Collapse excessive newlines
    .trim();
}

function parsePinpoxFormat(markdownContent: string): {
  conflictOfInterest: string;
  motivation: string;
} {
  const lines = markdownContent.split("\n");
  let conflictOfInterest = "";
  let motivation = "";
  let currentSection = "";
  let inMetadata = true;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // Skip metadata lines at the beginning
    if (inMetadata) {
      if (/^[-*]\s/.test(trimmed)) continue;
      if (trimmed === "") continue;
      inMetadata = false;
    }

    // Section headers
    if (/^conflict of interest/i.test(trimmed)) {
      currentSection = "conflict";
      continue;
    } else if (/^motivation/i.test(trimmed)) {
      currentSection = "motivation";
      continue;
    }

    // Collect content
    if (currentSection === "conflict") {
      conflictOfInterest += lines[i] + "\n";
    } else if (currentSection === "motivation") {
      // Convert "What I have done:" and "What I will do:" to headers
      if (/^What I (have done|will do):/i.test(trimmed)) {
        motivation += `## ${trimmed.replace(/:$/, "")}\n`;
      } else {
        motivation += lines[i] + "\n";
      }
    }
  }

  return {
    conflictOfInterest: normalizeContent(conflictOfInterest),
    motivation: normalizeContent(motivation),
  };
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

  while (i < lines.length) {
    const line = lines[i].trim();

    // Stop when we hit a section heading
    if (line.startsWith("###")) {
      break;
    }

    // Process lines that start with - or *
    if (line.startsWith("-") || line.startsWith("*")) {
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
    }

    i++;
  }

  if (!metadata.name || !metadata.githubHandle || !metadata.email) {
    throw new Error(`Missing required metadata in ${filename}`);
  }

  // Use dedicated parser for pinpox
  if (metadata.githubHandle === "pinpox") {
    const { conflictOfInterest, motivation } = parsePinpoxFormat(markdownContent);
    return {
      metadata: metadata as CandidateMetadata,
      conflictOfInterest,
      motivation,
    };
  }

  const sections = markdownContent.split(/(?=^#{1,3}\s)/m);

  let conflictOfInterest = "";
  const motivationParts: string[] = [];

  for (const section of sections) {
    if (
      /^#{1,3}\s+Conflict of interest/i.test(section)
    ) {
      conflictOfInterest = section
        .replace(/^#{0,3}\s*Conflict of interest[^\n]*\n+/i, "")
        .trim();
    } else if (/^#{1,3}\s+Motivation/i.test(section)) {
      // Remove the "Motivation..." header and just keep content
      const content = section.replace(/^#{1,3}\s+Motivation[^\n]*\n+/i, "").trim();
      if (content) {
        motivationParts.push(content);
      }
    } else if (
      /^#{1,3}\s+What I('ll|ll| will| would|'ve|ve| have) do(ne)?/i.test(section)
    ) {
      motivationParts.push(section);
    } else if (/^#{1,3}\s+/.test(section)) {
      // Skip "Candidate Template" section
      if (/^#{1,3}\s+Candidate Template/i.test(section)) {
        continue;
      }
      // All other sections become part of motivation
      motivationParts.push(section);
    }
  }

  // Fallback parser for content without headers
  if (motivationParts.length === 0 && !conflictOfInterest) {
    const lines = markdownContent.split("\n");
    let currentSection = "";
    let currentContent: string[] = [];
    let inMetadata = true;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip metadata lines at the beginning
      if (inMetadata) {
        if (/^[-*]\s/.test(trimmed)) continue;
        if (trimmed === "") continue;
        // We've hit content, no longer in metadata
        inMetadata = false;
      }

      // Check if line is a section header (matches known patterns)
      if (/^conflict of interest/i.test(trimmed)) {
        // Save previous section if any
        if (currentSection && currentContent.length > 0) {
          const content = currentContent.join("\n").trim();
          motivationParts.push(content);
        }
        currentSection = "conflict-of-interest";
        currentContent = [];
      } else if (/^motivation/i.test(trimmed)) {
        // Save previous section if any
        if (currentSection === "conflict-of-interest" && currentContent.length > 0) {
          conflictOfInterest = currentContent.join("\n").trim();
        }
        currentSection = "motivation";
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection && currentContent.length > 0) {
      const content = currentContent.join("\n").trim();
      if (currentSection === "conflict-of-interest") {
        conflictOfInterest = content;
      } else if (currentSection === "motivation") {
        motivationParts.push(content);
      }
    }
  }

  return {
    metadata: metadata as CandidateMetadata,
    conflictOfInterest: normalizeContent(conflictOfInterest),
    motivation: normalizeContent(motivationParts.join("\n\n")),
  };
}
