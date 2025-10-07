<script lang="ts">
  import { goto } from "$app/navigation";
</script>

<div class="font-sans">
  <header
    class="max-w-4xl mx-auto py-12 md:py-16 lg:py-24 px-4 md:px-6 lg:px-8"
  >
    <div class="mb-8">
      <button
        onclick={() => goto("/")}
        class="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white underline hover:no-underline"
      >
        ← Back to Home
      </button>
    </div>
    <h1
      class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-5 lg:mb-6"
    >
      Privacy Notice
    </h1>
  </header>

  <main class="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pb-16">
    <div class="prose dark:prose-invert max-w-none">
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Overview</h2>
        <p class="mb-4">
          This website processes publicly available information about NixOS
          Steering Committee election candidates to provide voters with
          transparent information and promote democratic participation.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Data We Collect</h2>
        <p class="mb-4">
          We collect and display the following publicly available information:
        </p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Candidate information:</strong> Names, GitHub handles, email
            addresses, Discourse handles, Matrix handles, conflict of interest statements,
            and motivation statements
          </li>
          <li>
            <strong>Question information:</strong> Question titles, descriptions,
            issue numbers, and asker GitHub handles
          </li>
          <li>
            <strong>Response information:</strong> Candidate responses to community
            questions
          </li>
          <li>
            <strong>Endorsement information:</strong> Candidate endorsements
          </li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Data Sources</h2>
        <p class="mb-4">All data is sourced from:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>
            The <a
              href="https://github.com/NixOS/SC-election-2025"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-700 dark:text-blue-300 underline hover:no-underline"
            >
              NixOS/SC-election-2025
            </a> GitHub repository (public)
          </li>
        </ul>
        <p class="mb-4">
          Data is automatically updated every 30 minutes from these public
          sources.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Legal Basis</h2>
        <p class="mb-4">
          We process this data based on <strong>legitimate interest</strong> in promoting
          democratic transparency and facilitating informed voting in the NixOS Steering
          Committee election.
        </p>
        <p class="mb-4">
          All information displayed is already publicly available and has been
          voluntarily submitted by candidates as part of their election
          nomination.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Contact</h2>
        <p class="mb-4">
          For any questions, amendment requests, deletion requests, or other
          concerns, please contact us at <a
            href="mailto:hey@sandydoo.me"
            class="text-blue-700 dark:text-blue-300 underline hover:no-underline"
          >
            hey@sandydoo.me
          </a>
          or directly update your information in the
          <a
            href="https://github.com/NixOS/SC-election-2025"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-700 dark:text-blue-300 underline hover:no-underline"
          >
            upstream repository
          </a>.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Data Retention</h2>
        <p class="mb-4">
          Data is retained for the duration of the election process.
        </p>
      </section>

      <section class="mb-8">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>
    </div>
  </main>
</div>
