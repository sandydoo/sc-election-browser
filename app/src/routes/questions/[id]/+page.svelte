<script lang="ts">
  import { renderMarkdown } from "$lib/markdown";

  let { data } = $props();
</script>

<div class="font-sans">
  <header class="max-w-7xl mx-auto py-12 px-8">
    <a href="/" class="mb-12 block">← Back to home</a>
    <p class="text-xl text-gray-700 dark:text-gray-300 mb-4">
      <a
        href="https://github.com/NixOS/SC-election-2025/issues/{data.question
          .issueNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        Issue #{data.question.issueNumber}
      </a>
    </p>
    <h1 class="text-5xl font-bold tracking-tight">
      {data.question.title}
    </h1>
  </header>

  <main class="max-w-7xl mx-auto px-8 py-16">
    <!-- Question Body -->
    {#if data.question.body}
      <section class="mb-16">
        <h2
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4"
        >
          Question
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.question.body)}
        </div>
      </section>
    {/if}

    <!-- Responses -->
    <section>
      <h2
        class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4"
      >
        Candidate Responses ({data.responses.length})
      </h2>
      <div class="space-y-12">
        {#each data.responses as response}
          <article class="pb-8">
            <p class="text-gray-700 dark:text-gray-300 mb-1 space-x-4">
              <a
                href="https://github.com/{response.candidate.githubHandle}"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:no-underline"
                tabindex="-1"
              >
                @{response.candidate.githubHandle}
              </a>
              <a
                href="https://github.com/NixOS/SC-election-2025/issues/{data
                  .question.issueNumber}#issuecomment-{response.commentId}"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:no-underline"
                tabindex="-1"
              >
                Response
              </a>
            </p>
            <h3
              class="text-2xl font-bold mb-2 sticky top-0 bg-white dark:bg-black py-2"
            >
              <a
                href="/candidates/{response.candidate.githubHandle}"
                class="hover:underline"
              >
                {response.candidate.name}
              </a>
            </h3>
            {#if response.response}
              <div class="prose max-w-none">
                {@html renderMarkdown(response.response, {
                  footnotePrefix: response.candidate.githubHandle,
                })}
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </section>
  </main>
</div>
