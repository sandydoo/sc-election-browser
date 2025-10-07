import { describe, it, expect } from "vitest";
import { parseCandidateMarkdown } from "./candidate.js";

describe("parseCandidateMarkdown", () => {
  describe("motivation section handling", () => {
    it("should parse standard motivation section", () => {
      const markdown = `
- Name: Test Candidate
- GitHub handle: testuser
- Email: test@example.com

### Motivation

This is my motivation content.

### Conflict of interest

None
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.metadata.name).toBe("Test Candidate");
      expect(result.metadata.githubHandle).toBe("testuser");
      expect(result.metadata.email).toBe("test@example.com");
      expect(result.motivation).toBe("This is my motivation content.");
    });

    it("should combine motivation, what I will do, and what I have done sections", () => {
      const markdown = `
- Name: Test Candidate
- GitHub handle: testuser
- Email: test@example.com

# Motivation

My motivation text.

# What I will do

My plans.

# What I have done

My achievements.

# Conflict of interest

None
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.motivation).toContain("My motivation text");
      expect(result.motivation).toContain("## What I will do");
      expect(result.motivation).toContain("My plans");
      expect(result.motivation).toContain("## What I have done");
      expect(result.motivation).toContain("My achievements");
    });

    it("should handle motivation with subsections", () => {
      const markdown = `
- Name: Test Candidate
- GitHub handle: testuser
- Email: test@example.com

## Motivation to be on the Steering Committee

### What I have done

Previous work.

### What I will do

Future plans.

## Conflict of interest

None
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.motivation).toContain("### What I have done");
      expect(result.motivation).toContain("Previous work");
      expect(result.motivation).toContain("### What I will do");
      expect(result.motivation).toContain("Future plans");
    });

    it("should normalize top-level headings to level 2", () => {
      const markdown = `
- Name: Test Candidate
- GitHub handle: testuser
- Email: test@example.com

# What I will do

Plans

# What I have done

Work

# Conflict of interest

None
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.motivation).toMatch(/^## What I will do/m);
      expect(result.motivation).toMatch(/## What I have done/m);
    });

    it("should handle content without markdown headers using fallback parser", () => {
      const markdown = `
- Name: Test Candidate
- GitHub handle: testuser
- Email: test@example.com

Conflict of interest disclosure

None

Motivation to be on the Steering Committee

This is my motivation content.
I want to contribute to the community.
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.conflictOfInterest).toBe("None");
      expect(result.motivation).toContain("This is my motivation content.");
      expect(result.motivation).toContain(
        "I want to contribute to the community.",
      );
    });

    it("should handle pinpox-style format with subsections", () => {
      const markdown = `
* Name: Test User
* GitHub handle: pinpox
* Email address: test@example.com
* Discourse handle (optional): testuser
* Matrix handle (optional): @testuser:example.org

Conflict of interest disclosure

List any potential conflicts of interest
- Example organization

Motivation to be on the Steering Committee
What I have done:
- Organized events
- Be part of community teams
- Help organize meetups
- Maintainership of packages and modules
- Build and maintained tools

What I will do:

- Help grow the community and projects in accordance with shared values.
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.metadata.name).toBe("Test User");
      expect(result.metadata.githubHandle).toBe("pinpox");
      expect(result.metadata.email).toBe("test@example.com");

      expect(result.conflictOfInterest).toContain(
        "List any potential conflicts of interest",
      );
      expect(result.conflictOfInterest).toContain("- Example organization");

      expect(result.motivation).toContain("## What I have done");
      expect(result.motivation).toContain("Organized events");
      expect(result.motivation).toContain("## What I will do");
      expect(result.motivation).toContain("Help grow the community");
    });

    it("should merge extra sections into motivation and normalize headers", () => {
      const markdown = `
* Name: Test Candidate
* GitHub handle: testuser
* Email: test@example.com

### Conflict of interest disclosure

None.

### Coalition Statement

I am proud to stand with others.

### Motivation to be on the Steering Committee

I want to help the community.

### What I Have Done

Contributed to nixpkgs.

### What I'll do

Continue contributing.

### Reach out

Contact me anytime.
`.trim();

      const result = parseCandidateMarkdown(markdown, "test.md");

      expect(result.conflictOfInterest).toBe("None.");

      expect(result.motivation).toContain("I want to help the community.");

      expect(result.motivation).toContain("## What I Have Done");
      expect(result.motivation).toContain("Contributed to nixpkgs.");

      expect(result.motivation).toContain("## What I'll do");
      expect(result.motivation).toContain("Continue contributing.");

      // Extra sections should now be part of motivation
      expect(result.motivation).toContain("## Coalition Statement");
      expect(result.motivation).toContain("I am proud to stand with others.");

      expect(result.motivation).toContain("## Reach out");
      expect(result.motivation).toContain("Contact me anytime.");
    });
  });
});
