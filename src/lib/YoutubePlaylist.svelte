<script lang="ts">
  import { ExternalLink, Youtube } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let playlistId = $derived(siteConfig.youtube.playlistId);
  let playlistTitle = $derived(siteConfig.youtube.playlistTitle || t.playlist.title);
  let playlistUrl = $derived(siteConfig.youtube.playlistUrl || siteConfig.youtube.channelUrl);
</script>

<section id="playlist" class="py-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800 bg-mono-50/50 dark:bg-mono-900/30">
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-mono-950 dark:text-mono-50">
        {playlistTitle}
      </h2>
    </div>

    {#if playlistId}
      <div class="border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 p-4 sm:p-6">
        <div class="relative w-full aspect-video bg-mono-950 border border-mono-200 dark:border-mono-800 overflow-hidden">
          <iframe
            class="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`}
            title={playlistTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    {:else}
      <div class="p-12 sm:p-16 border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 text-center">
        <div class="w-12 h-12 mx-auto border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 flex items-center justify-center text-mono-700 dark:text-mono-300 mb-4">
          <Youtube class="w-5 h-5 stroke-[1.75]" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-mono-950 dark:text-mono-50">
          {t.playlist.emptyTitle}
        </h3>
        <div class="mt-6">
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors"
          >
            <span>{t.playlist.btnYoutube}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>
