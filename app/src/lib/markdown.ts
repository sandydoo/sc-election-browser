import { marked, Marked } from "marked";
import markedFootnote from "marked-footnote";

const REPO_OWNER = "NixOS";
const REPO_NAME = "SC-election-2025";

const issueExtension = {
  name: "issue",
  level: "inline" as const,
  start(src: string) {
    return src.match(/#\d/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^#(\d+)\b/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "issue",
        raw: match[0],
        number: match[1],
      };
    }
  },
  renderer(token: { number: string }) {
    const url = `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/${token.number}`;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline">#${token.number}</a>`;
  },
};

const mentionExtension = {
  name: "mention",
  level: "inline" as const,
  start(src: string) {
    return src.match(/@[a-zA-Z0-9]/)?.index;
  },
  tokenizer(src: string) {
    const rule = /^@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)\b/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "mention",
        raw: match[0],
        handle: match[1],
      };
    }
  },
  renderer(token: { handle: string }) {
    const url = `https://github.com/${token.handle}`;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline hover:no-underline">@${token.handle}</a>`;
  },
};

marked.use({
  extensions: [issueExtension, mentionExtension],
  gfm: true,
  headerIds: true,
  mangle: false,
});

export function renderMarkdown(
  content: string | null,
  options?: { footnotePrefix?: string }
): string {
  if (!content) return "";

  if (options?.footnotePrefix) {
    const customMarked = new Marked();
    customMarked.use(markedFootnote({ prefixId: options.footnotePrefix }));
    customMarked.use({
      extensions: [issueExtension, mentionExtension],
      gfm: true,
      headerIds: true,
      mangle: false,
    });
    return customMarked.parse(content) as string;
  }

  return marked(content) as string;
}
