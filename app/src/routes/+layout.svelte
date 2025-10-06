<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<footer class="max-w-7xl mx-auto mt-24 px-8 py-12">
  <p class="text-sm mb-6">
    This is an unofficial resource to help browse information about the NixOS
    Steering Committee Election.
  </p>
  <div class="flex gap-8 text-sm">
    <a
      href="https://github.com/NixOS/SC-election-2025"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:no-underline"
    >
      Election Repository
    </a>
    <a
      href="https://github.com/sandydoo/sc-election-browser"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:no-underline"
    >
      View Source
    </a>
  </div>
  <p class="text-xs text-gray-600 mt-6">
    Data is queried from the <a
      href="https://github.com/NixOS/SC-election-2025"
      target="_blank"
      rel="noopener noreferrer"
      class="underline hover:no-underline"
    >
      nixos-election repo
    </a> and updated every 30 minutes.
  </p>
</footer>
