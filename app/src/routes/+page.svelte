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
        Browse candidates, questions, and responses for the NixOS Steering Committee election.
        This platform provides transparent access to all nomination materials and candidate statements.
      </p>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-8 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
      <!-- Candidates Section -->
      <section>
        <h2 class="text-4xl font-bold mb-8 border-b-2 border-black pb-4">
          Candidates ({data.candidates.length})
        </h2>
        <ul class="space-y-6">
          {#each data.candidates as candidate}
            <li class="py-2">
              <h3 class="text-2xl font-bold">
                <a href="/candidates/{candidate.githubHandle}" class="hover:underline">
                  {candidate.name}
                </a>
              </h3>
              <p class="text-lg text-gray-700">
                <a
                  href="https://github.com/{candidate.githubHandle}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:no-underline"
                >
                  @{candidate.githubHandle}
                </a>
              </p>
            </li>
          {/each}
        </ul>
      </section>

      <!-- Questions Section -->
      <section>
        <h2 class="text-4xl font-bold mb-8 border-b-2 border-black pb-4">
          Questions ({data.questions.length})
        </h2>
        <ul class="space-y-6">
          {#each data.questions as question}
            <li class="py-2">
              <h3 class="text-xl font-bold">
                <a href="/questions/{question.id}" class="hover:underline">
                  {question.title}
                </a>
              </h3>
              <p class="text-sm text-gray-700">
                <a
                  href="https://github.com/NixOS/SC-election-2025/issues/{question.issueNumber}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:no-underline"
                >
                  Issue #{question.issueNumber}
                </a>
              </p>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  </main>
</div>
