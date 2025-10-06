<script lang="ts">
  import { goto } from "$app/navigation";

  let { data } = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (event.key === "1") {
      document.getElementById("candidates-section")?.focus();
    } else if (event.key === "2") {
      document.getElementById("questions-section")?.focus();
    } else if (event.key === "3") {
      document.getElementById("footer-section")?.focus();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="font-sans">
  <header class="max-w-7xl mx-auto py-24 px-8">
    <h1 class="text-6xl font-bold tracking-tight mb-6">
      NixOS Steering Committee Election 2025
    </h1>
    <p class="text-xl max-w-3xl leading-relaxed">
      Browse candidates, questions, and responses for the NixOS Steering
      Committee election. This platform provides transparent access to all
      nomination materials and candidate statements.
    </p>
  </header>

  <main class="max-w-7xl mx-auto px-8 py-16">
    <nav class="mb-8 flex gap-4 text-sm" aria-label="Quick navigation">
      <a
        href="#candidates-section"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white dark:focus:bg-black focus:px-4 focus:py-2 focus:border-2 focus:border-black dark:focus:border-white underline hover:no-underline"
        >Jump to Candidates (press 1)</a
      >
      <a
        href="#questions-section"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-64 focus:z-50 focus:bg-white dark:focus:bg-black focus:px-4 focus:py-2 focus:border-2 focus:border-black dark:focus:border-white underline hover:no-underline"
        >Jump to Questions (press 2)</a
      >
      <a
        href="#footer-section"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-[32rem] focus:z-50 focus:bg-white dark:focus:bg-black focus:px-4 focus:py-2 focus:border-2 focus:border-black dark:focus:border-white underline hover:no-underline"
        >Jump to Footer (press 3)</a
      >
    </nav>
    <div class="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12">
      <!-- Candidates Section -->
      <div>
        <h2
          id="candidates-section"
          tabindex="-1"
          class="text-4xl font-bold mb-8 outline-none"
        >
          Candidates ({data.candidates.length})
        </h2>
        <ul class="space-y-6">
          {#each data.candidates as candidate}
            <li class="py-2">
              <div
                class="block border-1 border-transparent hover:border-black dark:hover:border-white p-4 -m-4 transition-colors cursor-pointer"
                onclick={() => goto(`/candidates/${candidate.githubHandle}`)}
                role="link"
                tabindex="0"
                onkeydown={(e) =>
                  e.key === "Enter" &&
                  goto(`/candidates/${candidate.githubHandle}`)}
              >
                <h3 class="text-2xl font-bold mb-1">
                  {candidate.name}
                </h3>
                <p class="text-lg text-blue-700 dark:text-blue-300">
                  <a
                    href="https://github.com/{candidate.githubHandle}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:no-underline"
                    tabindex="-1"
                    onclick={(e) => e.stopPropagation()}
                  >
                    @{candidate.githubHandle}
                  </a>
                </p>
              </div>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Questions Section -->
      <div>
        <h2
          id="questions-section"
          tabindex="-1"
          class="text-4xl font-bold mb-8 outline-none"
        >
          Questions ({data.questions.length})
        </h2>
        <ul class="space-y-6">
          {#each data.questions as question}
            <li class="py-2">
              <div
                class="block border-1 border-transparent hover:border-black dark:hover:border-white p-4 -m-4 transition-colors cursor-pointer"
                onclick={() => goto(`/questions/${question.id}`)}
                role="link"
                tabindex="0"
                onkeydown={(e) =>
                  e.key === "Enter" && goto(`/questions/${question.id}`)}
              >
                <p
                  class="text-sm text-gray-700 dark:text-gray-300 mb-2 space-x-2"
                >
                  <a
                    href="https://github.com/NixOS/SC-election-2025/issues/{question.issueNumber}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:no-underline"
                    tabindex="-1"
                    onclick={(e) => e.stopPropagation()}
                  >
                    Issue #{question.issueNumber}
                  </a>
                </p>
                <h3 class="text-xl font-bold">
                  {question.title}
                </h3>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </main>
</div>
