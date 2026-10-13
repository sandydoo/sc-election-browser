/**
 * Get the GitHub handle of the nominee from the title of a nomination PR.
 *
 * Titles have different formats, for example:
 * - `Nominate niklaskorz`
 * - `Nominate @toastal (Kai Dao)`
 * - `Nominate Shahar "Dawn" Or (@mightyiam)`
 */
export function parseNomineeHandle(title: string): string {
  const mention = title.match(/@([\w-]+)/);
  if (mention) return mention[1];

  return title
    .replace(/^Nominate\s+/i, "")
    .replace(/`/g, "")
    .trim()
    .split(/\s+/)[0];
}
