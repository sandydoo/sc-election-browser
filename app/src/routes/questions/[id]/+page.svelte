<script lang="ts">
  import { renderMarkdown } from "$lib/markdown";
  import { goto } from "$app/navigation";
  import HashLink from "$lib/components/HashLink.svelte";

  let { data } = $props();

  function setHash(hash: string) {
    if (hash) {
      window.location.hash = hash;
    } else {
      history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search,
      );
    }
  }

  function handleGlobalKeyDown(event: KeyboardEvent) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const currentIndex = data.allQuestions.findIndex(
      (q) => q.id === data.question.id,
    );

    const hash = window.location.hash;

    if (event.key === "ArrowLeft" && currentIndex > 0) {
      const prevQuestion = data.allQuestions[currentIndex - 1];
      goto(`/questions/${prevQuestion.id}${hash}`);
    } else if (
      event.key === "ArrowRight" &&
      currentIndex < data.allQuestions.length - 1
    ) {
      const nextQuestion = data.allQuestions[currentIndex + 1];
      goto(`/questions/${nextQuestion.id}${hash}`);
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

<div class="font-sans">
  <header class="max-w-7xl mx-auto py-12 px-8">
    <div class="mb-12 flex items-center justify-between">
      <a href="/" class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><span class="font-mono mr-2">←</span>Back to home</a>
      <div class="hidden md:flex items-center gap-1 text-sm">
        <button
          class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={data.allQuestions.findIndex(
            (q) => q.id === data.question.id,
          ) === 0}
          onclick={() => {
            const currentIndex = data.allQuestions.findIndex(
              (q) => q.id === data.question.id,
            );
            if (currentIndex > 0) {
              const prevQuestion = data.allQuestions[currentIndex - 1];
              goto(`/questions/${prevQuestion.id}${window.location.hash}`);
            }
          }}
          aria-label="Previous question"
        >
          ←
        </button>
        <button
          class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={data.allQuestions.findIndex(
            (q) => q.id === data.question.id,
          ) ===
            data.allQuestions.length - 1}
          onclick={() => {
            const currentIndex = data.allQuestions.findIndex(
              (q) => q.id === data.question.id,
            );
            if (currentIndex < data.allQuestions.length - 1) {
              const nextQuestion = data.allQuestions[currentIndex + 1];
              goto(`/questions/${nextQuestion.id}${window.location.hash}`);
            }
          }}
          aria-label="Next question"
        >
          →
        </button>
      </div>
    </div>
    <p class="text-gray-700 dark:text-gray-300 space-x-4">
      <a
        href="https://github.com/NixOS/SC-election-2025/issues/{data.question
          .issueNumber}"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        Issue #{data.question.issueNumber}
      </a>
      {#if data.question.askerHandle}
        Asked by
        <a
          href="https://github.com/{data.question.askerHandle}"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:no-underline"
        >
          @{data.question.askerHandle}
        </a>
      {/if}
    </p>
    <h1 class="text-5xl font-bold tracking-tight mt-4 group cursor-pointer flex items-center gap-3" onclick={() => setHash("")}>
      <span>{data.question.title}</span>
      <HashLink hash="" />
    </h1>
  </header>

  <main class="max-w-7xl mx-auto px-8 py-16">
    <!-- Question Body -->
    {#if data.question.body}
      <section id="question" class="mb-16">
        <h2
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group"
        >
          <span class="flex items-center gap-2">
            <span>Question</span>
            <HashLink hash="question" />
          </span>
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.question.body)}
        </div>
      </section>
    {/if}

    <!-- Responses -->
    <section id="responses">
      <h2
        class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group"
      >
        <span class="flex items-center gap-2">
          <span>Candidate Responses ({data.responses.length})</span>
          <HashLink hash="responses" />
        </span>
      </h2>
      <div class="space-y-12">
        {#each data.responses as response}
          <article id={response.candidate.githubHandle} class="pb-8">
            <div>
              <p class="text-gray-700 dark:text-gray-300 space-x-4">
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
              <h3 class="text-2xl font-bold mt-3 group flex items-center gap-3">
                <a
                  href="/candidates/{response.candidate.githubHandle}"
                  class="hover:underline"
                >
                  {response.candidate.name}
                </a>
                <HashLink hash={response.candidate.githubHandle} />
              </h3>
              <p class="text-blue-700 dark:text-blue-300 mt-1">
                <a
                  href="https://github.com/{response.candidate.githubHandle}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:no-underline"
                  tabindex="-1"
                >
                  @{response.candidate.githubHandle}
                </a>
              </p>
            </div>
            {#if response.response}
              <div class="prose max-w-none mt-4">
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
