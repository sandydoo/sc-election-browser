<script lang="ts">
  import { page } from "$app/state";
</script>

<div class="font-sans">
  <div class="max-w-7xl mx-auto px-8 py-24 min-h-[70vh] flex items-center justify-center">
    <div class="max-w-2xl text-center">
      <h1 class="text-[12rem] font-bold tracking-tight leading-none mb-4">
        {page.status}
      </h1>
      <h2 class="text-4xl font-bold tracking-tight mb-8">
        {page.status === 404 ? "Page Not Found" : "Something Went Wrong"}
      </h2>
      <p class="text-xl mb-12 leading-relaxed">
        {page.status === 404
          ? "The page you're looking for doesn't exist."
          : page.error?.message || "An unexpected error occurred."}
      </p>
      <a
        href="/"
        class="px-3 py-1.5 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <span class="font-mono mr-2">←</span>Back to home
      </a>
    </div>
  </div>
</div>
