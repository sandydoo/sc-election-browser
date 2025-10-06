<script lang="ts">
  import { renderMarkdown } from "$lib/markdown";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import HashLink from "$lib/components/HashLink.svelte";

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

    const hash = window.location.hash.slice(1);
    if (hash) {
      const sectionMap: Record<string, string> = {
        motivation: "motivation",
        "what-i-will-do": "whatIWillDo",
        "what-i-have-done": "whatIHaveDone",
        "conflict-of-interest": "conflictOfInterest",
        responses: "responses",
      };
      const section = sectionMap[hash];
      if (section && collapsed[section]) {
        collapsed[section] = false;
        localStorage.setItem(
          "candidateSectionsCollapsed",
          JSON.stringify(collapsed),
        );
      }
    }
  });

  function toggleSection(section: string) {
    collapsed[section] = !collapsed[section];
    localStorage.setItem(
      "candidateSectionsCollapsed",
      JSON.stringify(collapsed),
    );
  }

  function handleKeyDown(event: KeyboardEvent, section: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSection(section);
    }
  }

  function handleGlobalKeyDown(event: KeyboardEvent) {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const currentIndex = data.allCandidates.findIndex(
      (c) => c.githubHandle === data.candidate.githubHandle,
    );

    const hash = window.location.hash;

    if (event.key === "ArrowLeft" && currentIndex > 0) {
      const prevCandidate = data.allCandidates[currentIndex - 1];
      goto(`/candidates/${prevCandidate.githubHandle}${hash}`);
    } else if (
      event.key === "ArrowRight" &&
      currentIndex < data.allCandidates.length - 1
    ) {
      const nextCandidate = data.allCandidates[currentIndex + 1];
      goto(`/candidates/${nextCandidate.githubHandle}${hash}`);
    }
  }

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
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

<div class="font-sans">
  <header class="max-w-7xl mx-auto py-12 px-8">
    <div class="mb-12 flex items-center justify-between">
      <a href="/" class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><span class="font-mono mr-2">←</span>Back to home</a>
      <div class="hidden md:flex items-center gap-1 text-sm">
        <button
          class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={data.allCandidates.findIndex(
            (c) => c.githubHandle === data.candidate.githubHandle,
          ) === 0}
          onclick={() => {
            const currentIndex = data.allCandidates.findIndex(
              (c) => c.githubHandle === data.candidate.githubHandle,
            );
            if (currentIndex > 0) {
              const prevCandidate = data.allCandidates[currentIndex - 1];
              goto(`/candidates/${prevCandidate.githubHandle}${window.location.hash}`);
            }
          }}
          aria-label="Previous candidate"
        >
          ←
        </button>
        <button
          class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          disabled={data.allCandidates.findIndex(
            (c) => c.githubHandle === data.candidate.githubHandle,
          ) ===
            data.allCandidates.length - 1}
          onclick={() => {
            const currentIndex = data.allCandidates.findIndex(
              (c) => c.githubHandle === data.candidate.githubHandle,
            );
            if (currentIndex < data.allCandidates.length - 1) {
              const nextCandidate = data.allCandidates[currentIndex + 1];
              goto(`/candidates/${nextCandidate.githubHandle}${window.location.hash}`);
            }
          }}
          aria-label="Next candidate"
        >
          →
        </button>
      </div>
    </div>
    <p class="text-gray-700 dark:text-gray-300 space-x-4 mb-2">
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
    <h1 class="text-5xl font-bold tracking-tight group cursor-pointer flex items-center gap-3" onclick={() => setHash("")}>
      <span>{data.candidate.name}</span>
      <HashLink hash="" />
    </h1>
    <p class="text-2xl text-blue-700 dark:text-blue-300 mt-2">
      <a
        href="https://github.com/{data.candidate.githubHandle}"
        target="_blank"
        rel="noopener noreferrer"
        class="underline hover:no-underline"
      >
        @{data.candidate.githubHandle}
      </a>
    </p>
    <dl class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
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
      <section id="motivation" class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group">
          <button
            onclick={() => toggleSection("motivation")}
            onkeydown={(e) => handleKeyDown(e, "motivation")}
            class="w-full flex justify-between items-center cursor-pointer text-left"
          >
            <span class="flex items-center gap-2">
              <span>Motivation</span>
              <HashLink hash="motivation" />
            </span>
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
          </button>
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
      <section id="what-i-will-do" class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group">
          <button
            onclick={() => toggleSection("whatIWillDo")}
            onkeydown={(e) => handleKeyDown(e, "whatIWillDo")}
            class="w-full flex justify-between items-center cursor-pointer text-left"
          >
            <span class="flex items-center gap-2">
              <span>What I will do</span>
              <HashLink hash="what-i-will-do" />
            </span>
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
          </button>
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
      <section id="what-i-have-done" class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group">
          <button
            onclick={() => toggleSection("whatIHaveDone")}
            onkeydown={(e) => handleKeyDown(e, "whatIHaveDone")}
            class="w-full flex justify-between items-center cursor-pointer text-left"
          >
            <span class="flex items-center gap-2">
              <span>What I have done</span>
              <HashLink hash="what-i-have-done" />
            </span>
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
          </button>
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
      <section id="conflict-of-interest" class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group">
          <button
            onclick={() => toggleSection("conflictOfInterest")}
            onkeydown={(e) => handleKeyDown(e, "conflictOfInterest")}
            class="w-full flex justify-between items-center cursor-pointer text-left"
          >
            <span class="flex items-center gap-2">
              <span>Conflict of interest</span>
              <HashLink hash="conflict-of-interest" />
            </span>
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
          </button>
        </h2>
        {#if !collapsed.conflictOfInterest}
          <div class="prose max-w-none">
            {@html renderMarkdown(data.candidate.conflictOfInterest)}
          </div>
        {/if}
      </section>
    {/if}

    <!-- Responses -->
    <section id="responses">
      <h2 class="text-3xl font-bold mb-6 border-b-2 border-black dark:border-white pb-4 group">
        <button
          onclick={() => toggleSection("responses")}
          onkeydown={(e) => handleKeyDown(e, "responses")}
          class="w-full flex justify-between items-center cursor-pointer text-left"
        >
          <span class="flex items-center gap-2">
            <span>Question responses ({data.responses.length})</span>
            <HashLink hash="responses" />
          </span>
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
        </button>
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
