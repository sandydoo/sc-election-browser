<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { themeState } from "$lib/theme.svelte";

  let { children } = $props();

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
    class="max-w-7xl mx-auto mt-24 px-8 py-12 outline-none"
  >
    <p class="text-sm mb-6">
      This is an unofficial resource to help voters browse information about the
      NixOS Steering Committee Election.
    </p>
    <div class="flex gap-8 text-sm items-center">
      <ThemeToggle />
      <a
        href="https://github.com/sandydoo/sc-election-browser"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        View Source
      </a>
    </div>
    <p class="text-xs text-gray-600 dark:text-gray-400 mt-6">
      Data is queried from the <a
        href="https://github.com/NixOS/SC-election-2025"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        NixOS/SC-election-2025 repository
      </a> and updated every 30 minutes.
    </p>
  </footer>
</div>
