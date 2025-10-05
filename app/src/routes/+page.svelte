<script lang="ts">
  let { data } = $props();
</script>

<div class="min-h-screen bg-white text-black font-sans">
  <header class="py-24 px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-6xl font-bold tracking-tight mb-6">
        NixOS Steering Committee Election 2025
      </h1>
      <p class="text-xl max-w-3xl leading-relaxed">
        Browse candidates, questions, and responses for the NixOS Steering
        Committee election. This platform provides transparent access to all
        nomination materials and candidate statements.
      </p>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2">
      <!-- Candidates Section -->
      <div class="p-8">
        <h2 class="text-4xl font-bold mb-8">
          Candidates ({data.candidates.length})
        </h2>
        <ul class="space-y-6">
          {#each data.candidates as candidate}
            <li class="py-2">
              <div
                class="block hover:bg-gray-50 p-4 -m-4 rounded-lg transition-colors cursor-pointer"
                onclick={() =>
                  (window.location.href = `/candidates/${candidate.githubHandle}`)}
                role="link"
                tabindex="0"
                onkeydown={(e) =>
                  e.key === "Enter" &&
                  (window.location.href = `/candidates/${candidate.githubHandle}`)}
              >
                <h3 class="text-2xl font-bold mb-1">
                  {candidate.name}
                </h3>
                <p class="text-lg text-gray-700">
                  <a
                    href="https://github.com/{candidate.githubHandle}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:no-underline"
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
      <div class="p-8">
        <h2 class="text-4xl font-bold mb-8">
          Questions ({data.questions.length})
        </h2>
        <ul class="space-y-6">
          {#each data.questions as question}
            <li class="py-2">
              <div
                class="block hover:bg-gray-50 p-4 -m-4 rounded-lg transition-colors cursor-pointer"
                onclick={() =>
                  (window.location.href = `/questions/${question.id}`)}
                role="link"
                tabindex="0"
                onkeydown={(e) =>
                  e.key === "Enter" &&
                  (window.location.href = `/questions/${question.id}`)}
              >
                <h3 class="text-xl font-bold mb-2">
                  {question.title}
                </h3>
                <p class="text-sm text-gray-700">
                  <a
                    href="https://github.com/NixOS/SC-election-2025/issues/{question.issueNumber}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="underline hover:no-underline"
                    onclick={(e) => e.stopPropagation()}
                  >
                    Issue #{question.issueNumber}
                  </a>
                </p>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </main>
</div>
