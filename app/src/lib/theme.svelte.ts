type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "system" || stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

function getEffectiveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme;
}

class ThemeState {
  preference = $state<Theme>("system");
  effective = $state<"light" | "dark">("light");
  initialized = $state(false);

  init() {
    if (this.initialized || typeof window === "undefined") return;

    const stored = getStoredTheme();
    this.preference = stored ?? "system";
    this.effective = getEffectiveTheme(this.preference);
    this.initialized = true;

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (this.preference === "system") {
          this.effective = e.matches ? "dark" : "light";
        }
      });
  }

  setTheme(theme: Theme) {
    this.preference = theme;
    this.effective = getEffectiveTheme(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  toggle() {
    const next: Theme =
      this.preference === "system"
        ? "light"
        : this.preference === "light"
          ? "dark"
          : "system";
    this.setTheme(next);
  }
}

export const themeState = new ThemeState();
