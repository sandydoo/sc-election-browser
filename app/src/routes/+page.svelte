<script lang="ts">
  let { data } = $props();
</script>

<div class="min-h-screen bg-white text-black font-sans">
  <header class="border-b-2 border-black py-24 px-8">
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
            <li class="border-l-4 border-black pl-4">
              <h3 class="text-2xl font-bold">{candidate.name}</h3>
              <p class="text-lg text-gray-700">@{candidate.githubHandle}</p>
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
            <li class="border-l-4 border-black pl-4">
              <h3 class="text-xl font-bold">{question.title}</h3>
              <p class="text-sm text-gray-700">Issue #{question.issueNumber}</p>
            </li>
          {/each}
        </ul>
      </section>
    </div>
  </main>
</div>
