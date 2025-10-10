<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { themeState } from "$lib/theme.svelte";

  let { children, data } = $props();

  function formatLastUpdated(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Last updated just now";
    if (diffMins < 60)
      return `Last updated ${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `Last updated ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7)
      return `Last updated ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    return `Last updated ${date.toLocaleDateString()}`;
  }

  function formatAbsoluteTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toISOString();
  }

  $effect(() => {
    themeState.init();
  });

  $effect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");

    if (themeState.preference === "system") {
      if (themeState.effective === "dark") {
        html.classList.add("dark");
      }
    } else if (themeState.preference === "light") {
      html.classList.add("light");
    } else if (themeState.preference === "dark") {
      html.classList.add("dark");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-white dark:bg-black text-black dark:text-white">
  {@render children?.()}

  <footer
    id="footer-section"
    tabindex="-1"
    class="max-w-7xl mx-auto mt-24 px-4 md:px-6 lg:px-8 py-12 outline-none"
  >
    <p class="text-sm mb-6">
      This is an unofficial resource to help voters browse information about the
      NixOS Steering Committee Election.
    </p>
    <div class="flex gap-8 text-sm items-center">
      <ThemeToggle />
    </div>
    <p class="text-xs text-gray-600 dark:text-gray-400 mt-6">
      Data is queried from the <a
        href="https://github.com/NixOS/SC-election-2025"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        NixOS/SC-election-2025
      </a> repository and updated every 30 minutes.
      {#if data.lastUpdatedAt}
        <br />
        <span title={formatAbsoluteTime(data.lastUpdatedAt)}>
          {formatLastUpdated(data.lastUpdatedAt)}
        </span>
      {/if}
    </p>
    <p class="text-xs text-gray-600 dark:text-gray-400 mt-4 space-x-4">
      <a
        href="https://github.com/sandydoo/sc-election-browser"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        View Source
      </a>
      <a href="/privacy" class="underline hover:no-underline">
        Privacy Notice
      </a>
    </p>
  </footer>
</div>
