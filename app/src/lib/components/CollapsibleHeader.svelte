<script lang="ts">
  import HashLink from "$lib/components/HashLink.svelte";

  let {
    title,
    hash,
    collapsed,
    ontoggle,
  }: {
    title: string;
    hash: string;
    collapsed: boolean;
    ontoggle: () => void;
  } = $props();

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      ontoggle();
    }
  }
</script>

<h2
  class="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-5 lg:mb-6 border-b-2 border-black dark:border-white pb-3 md:pb-4 group"
>
  <div
    role="button"
    tabindex="0"
    onclick={ontoggle}
    onkeydown={handleKeyDown}
    class="w-full flex justify-between items-center cursor-pointer"
  >
    <span class="flex items-center gap-2">
      <span>{title}</span>
      <HashLink {hash} />
    </span>
    <span
      class="p-1 transition-transform duration-200"
      style="transform: rotate({collapsed ? -90 : 0}deg)"
      aria-label={collapsed ? "Expand" : "Collapse"}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>
  </div>
</h2>
