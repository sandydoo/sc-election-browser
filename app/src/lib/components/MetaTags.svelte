<script lang="ts">
  import { page } from "$app/state";

  interface Props {
    title: string;
    description: string;
    ogImageParams?: {
      title?: string;
      description?: string;
      type?: string;
    };
  }

  let { title, description, ogImageParams }: Props = $props();

  const fullTitle =
    title === "NixOS SC Election 2025"
      ? title
      : `${title} | NixOS SC Election 2025`;

  const ogImageUrl = $derived(() => {
    const params = new URLSearchParams();
    params.set("title", ogImageParams?.title || title);
    params.set("description", ogImageParams?.description || description);
    if (ogImageParams?.type) {
      params.set("type", ogImageParams.type);
    }
    return `${page.url.origin}/api/og?${params.toString()}`;
  });

  const canonicalUrl = $derived(page.url.href);
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImageUrl()} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:domain" content={page.url.hostname} />
  <meta name="twitter:url" content={canonicalUrl} />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImageUrl()} />
</svelte:head>
