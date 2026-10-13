import { describe, it, expect } from "vitest";
import { parseNomineeHandle } from "./nomination.js";

describe("parseNomineeHandle", () => {
  it.each([
    ["Nominate niklaskorz", "niklaskorz"],
    ["Nominate @fzakaria", "fzakaria"],
    ["Nominate `pinpox`", "pinpox"],
    ["Nominate @toastal (Kai Dao)", "toastal"],
    ["Nominate @Malix-Labs (Malix - Alix Brunet)", "Malix-Labs"],
    ['Nominate Shahar "Dawn" Or (@mightyiam)', "mightyiam"],
  ])("parses %s", (title, handle) => {
    expect(parseNomineeHandle(title)).toBe(handle);
  });
});
