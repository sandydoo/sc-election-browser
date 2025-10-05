<script lang="ts">
  import { renderMarkdown } from "$lib/markdown";

  let { data } = $props();
</script>

<div class="min-h-screen bg-white text-black font-sans">
  <header class="py-12 px-8">
    <div class="max-w-7xl mx-auto">
      <a href="/" class="mb-4 block">← Back to home</a>
      <h1 class="text-5xl font-bold tracking-tight mb-2">
        {data.candidate.name}
      </h1>
      <p class="text-2xl text-gray-700 mb-4">
        <a
          href="https://github.com/{data.candidate.githubHandle}"
          target="_blank"
          rel="noopener noreferrer"
          class="underline hover:no-underline"
        >
          @{data.candidate.githubHandle}
        </a>
      </p>
    </div>
    <dl class="space-y-4">
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
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black pb-4">
          Motivation
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.candidate.motivation)}
        </div>
      </section>
    {/if}

    <!-- What I Will Do -->
    {#if data.candidate.whatIWillDo}
      <section class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black pb-4">
          What I will do
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.candidate.whatIWillDo)}
        </div>
      </section>
    {/if}

    <!-- What I Have Done -->
    {#if data.candidate.whatIHaveDone}
      <section class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black pb-4">
          What I have done
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.candidate.whatIHaveDone)}
        </div>
      </section>
    {/if}

    <!-- Conflict of Interest -->
    {#if data.candidate.conflictOfInterest}
      <section class="mb-16">
        <h2 class="text-3xl font-bold mb-6 border-b-2 border-black pb-4">
          Conflict of interest
        </h2>
        <div class="prose max-w-none">
          {@html renderMarkdown(data.candidate.conflictOfInterest)}
        </div>
      </section>
    {/if}

    <!-- Responses -->
    <section>
      <h2 class="text-3xl font-bold mb-6 border-b-2 border-black pb-4">
        Question responses ({data.responses.length})
      </h2>
      <div class="space-y-12">
        {#each data.responses as response}
          <article class="">
            <h3 class="text-2xl font-bold mb-2">
              <a
                href="/questions/{response.question.id}"
                class="hover:underline"
              >
                {response.question.title}
              </a>
            </h3>
            <p class="text-sm text-gray-700 mb-4">
              <a
                href="https://github.com/NixOS/SC-election-2025/issues/{response
                  .question.issueNumber}#issuecomment-{response.commentId}"
                target="_blank"
                rel="noopener noreferrer"
                class="underline hover:no-underline"
              >
                Issue #{response.question.issueNumber}
              </a>
            </p>
            {#if response.response}
              <div class="prose max-w-none">
                {@html renderMarkdown(response.response)}
              </div>
            {/if}
          </article>
        {/each}
      </div>
    </section>
  </main>
</div>
