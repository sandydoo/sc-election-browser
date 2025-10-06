<script lang="ts">
  import { renderMarkdown } from "$lib/markdown";
  import { onMount } from "svelte";

  let { data } = $props();

  let collapsed = $state<Record<string, boolean>>({
    motivation: false,
    whatIWillDo: false,
    whatIHaveDone: false,
    conflictOfInterest: false,
    responses: false,
  });

  onMount(() => {
    const stored = localStorage.getItem("candidateSectionsCollapsed");
    if (stored) {
      collapsed = JSON.parse(stored);
    }
  });

  function toggleSection(section: string) {
    collapsed[section] = !collapsed[section];
    localStorage.setItem(
      "candidateSectionsCollapsed",
      JSON.stringify(collapsed),
    );
  }
</script>

<div class="font-sans">
  <header class="max-w-7xl mx-auto py-12 px-8">
    <a href="/" class="mb-12 block">← Back to home</a>
    <p class="text-gray-700 dark:text-gray-300 space-x-4 mb-2">
      {#if data.candidate.nominationPrNumber}
        <a
          href="https://github.com/NixOS/SC-election-2025/pull/{data.candidate
            .nominationPrNumber}"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:no-underline"
          tabindex="-1"
        >
          PR #{data.candidate.nominationPrNumber}
        </a>
      {/if}
      <a
        href="https://github.com/NixOS/SC-election-2025/blob/main/candidates/{data
          .candidate.githubHandle}.md"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
        tabindex="-1"
      >
        Statement
      </a>
    </p>
    <h1 class="text-5xl font-bold tracking-tight mb-2">
      {data.candidate.name}
    </h1>
    <p class="text-2xl text-gray-700 dark:text-gray-300 mb-4">
      <a
        href="https://github.com/{data.candidate.githubHandle}"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        @{data.candidate.githubHandle}
      </a>
    </p>
    <dl class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <dt class="font-bold">Email:</dt>
        <dd>{data.candidate.email}</dd>
      </div>
      {#if data.candidate.discourseHandle}
        <div>
          <dt class="font-bold">Discourse:</dt>
          <dd>
            <a
              href="https://discourse.nixos.org/u/{data.candidate
                .discourseHandle}/summary"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:no-underline"
            >
              {data.candidate.discourseHandle}
            </a>
          </dd>
        </div>
      {/if}
      {#if data.candidate.matrixHandle}
        <div>
          <dt class="font-bold">Matrix:</dt>
          <dd>
            <a
              href="https://matrix.to/#/{data.candidate.matrixHandle}"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:no-underline"
            >
              {data.candidate.matrixHandle}
            </a>
          </dd>
        </div>
      {/if}
      {#if data.candidate.nominatedBy}
        <div>
          <dt class="font-bold">Nominated by:</dt>
          <dd>
            <a
              href="https://github.com/{data.candidate.nominatedBy}"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:no-underline"
            >
              @{data.candidate.nominatedBy}
            </a>
          </dd>
        </div>
      {/if}
      {#if data.candidate.endorsers && data.candidate.endorsers.length > 0}
        <div>
          <dt class="font-bold">
            Endorsed by ({data.candidate.endorsers.length}):
          </dt>
          <dd class="mt-2">
            {#each data.candidate.endorsers as endorser, i}
              <a
                href="https://github.com/{endorser}"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:no-underline"
              >
                @{endorser}
              </a>{i < data.candidate.endorsers.length - 1 ? ", " : ""}
            {/each}
          </dd>
        </div>
      {/if}
    </dl>
  </header>

  <main class="max-w-7xl mx-auto px-8 py-5">
    <!-- Motivation -->
    {#if data.candidate.motivation}
      <section class="mb-16">
        <h2
          onclick={() => toggleSection("motivation")}
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 flex justify-between items-center cursor-pointer"
        >
          <span>Motivation</span>
          <span
            class="p-1 transition-transform duration-200"
            style="transform: rotate({collapsed.motivation ? -90 : 0}deg)"
            aria-label={collapsed.motivation ? "Expand" : "Collapse"}
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
        </h2>
        {#if !collapsed.motivation}
          <div class="prose max-w-none">
            {@html renderMarkdown(data.candidate.motivation)}
          </div>
        {/if}
      </section>
    {/if}

    <!-- What I Will Do -->
    {#if data.candidate.whatIWillDo}
      <section class="mb-16">
        <h2
          onclick={() => toggleSection("whatIWillDo")}
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 flex justify-between items-center cursor-pointer"
        >
          <span>What I will do</span>
          <span
            class="p-1 transition-transform duration-200"
            style="transform: rotate({collapsed.whatIWillDo ? -90 : 0}deg)"
            aria-label={collapsed.whatIWillDo ? "Expand" : "Collapse"}
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
        </h2>
        {#if !collapsed.whatIWillDo}
          <div class="prose max-w-none">
            {@html renderMarkdown(data.candidate.whatIWillDo)}
          </div>
        {/if}
      </section>
    {/if}

    <!-- What I Have Done -->
    {#if data.candidate.whatIHaveDone}
      <section class="mb-16">
        <h2
          onclick={() => toggleSection("whatIHaveDone")}
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 flex justify-between items-center cursor-pointer"
        >
          <span>What I have done</span>
          <span
            class="p-1 transition-transform duration-200"
            style="transform: rotate({collapsed.whatIHaveDone ? -90 : 0}deg)"
            aria-label={collapsed.whatIHaveDone ? "Expand" : "Collapse"}
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
        </h2>
        {#if !collapsed.whatIHaveDone}
          <div class="prose max-w-none">
            {@html renderMarkdown(data.candidate.whatIHaveDone)}
          </div>
        {/if}
      </section>
    {/if}

    <!-- Conflict of Interest -->
    {#if data.candidate.conflictOfInterest}
      <section class="mb-16">
        <h2
          onclick={() => toggleSection("conflictOfInterest")}
          class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 flex justify-between items-center cursor-pointer"
        >
          <span>Conflict of interest</span>
          <span
            class="p-1 transition-transform duration-200"
            style="transform: rotate({collapsed.conflictOfInterest
              ? -90
              : 0}deg)"
            aria-label={collapsed.conflictOfInterest ? "Expand" : "Collapse"}
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
        </h2>
        {#if !collapsed.conflictOfInterest}
          <div class="prose max-w-none">
            {@html renderMarkdown(data.candidate.conflictOfInterest)}
          </div>
        {/if}
      </section>
    {/if}

    <!-- Responses -->
    <section>
      <h2
        onclick={() => toggleSection("responses")}
        class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 flex justify-between items-center cursor-pointer"
      >
        <span>Question responses ({data.responses.length})</span>
        <span
          class="p-1 transition-transform duration-200"
          style="transform: rotate({collapsed.responses ? -90 : 0}deg)"
          aria-label={collapsed.responses ? "Expand" : "Collapse"}
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
      </h2>
      {#if !collapsed.responses}
        <div class="space-y-12">
          {#each data.responses as response}
            <article>
              <p class="text-gray-700 dark:text-gray-300 space-x-4 mb-2">
                <a
                  href="https://github.com/NixOS/SC-election-2025/issues/{response
                    .question.issueNumber}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:no-underline"
                  tabindex="-1"
                >
                  Issue #{response.question.issueNumber}
                </a>
                <a
                  href="https://github.com/NixOS/SC-election-2025/issues/{response
                    .question.issueNumber}#issuecomment-{response.commentId}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:no-underline"
                  tabindex="-1"
                >
                  Response
                </a>
              </p>
              <h3 class="text-2xl font-bold mb-4">
                <a
                  href="/questions/{response.question.id}"
                  class="hover:underline"
                >
                  {response.question.title}
                </a>
              </h3>
              {#if response.response}
                <div class="prose max-w-none">
                  {@html renderMarkdown(response.response, {
                    footnotePrefix: `q${response.question.id}`,
                  })}
                </div>
              {/if}
            </article>
          {/each}
        </div>
      {/if}
    </section>
  </main>
</div>
