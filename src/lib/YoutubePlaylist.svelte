<script lang="ts">
  import { ListVideo, ExternalLink, Play, Youtube } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let videos = $derived(siteConfig.youtube.videos);
  let activeIndex = $state(0);
  let activeVideo = $derived(videos[activeIndex]);
</script>

<section id="playlist" class="py-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800 bg-mono-50/50 dark:bg-mono-900/30">
  <div class="max-w-6xl mx-auto">
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-mono-950 dark:text-mono-50">
          {t.playlist.title}
        </h2>
      </div>

      <a
        href={siteConfig.youtube.channelUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 border border-mono-300 dark:border-mono-800 bg-white dark:bg-mono-900 text-xs font-mono font-semibold uppercase tracking-wider text-mono-950 dark:text-mono-50 hover:border-mono-950 dark:hover:border-mono-50 transition-colors w-fit"
      >
        <span>{t.playlist.btnYoutube}</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
    </div>

    {#if videos.length > 0}
      <div class="border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 p-6 sm:p-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-8 flex flex-col justify-between">
            <div class="relative w-full aspect-video bg-mono-950 border border-mono-200 dark:border-mono-800 overflow-hidden">
              <iframe
                class="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.embedId}?autoplay=0&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div class="mt-5 flex items-center justify-between">
              <div>
                <h3 class="text-base sm:text-lg font-bold text-mono-950 dark:text-mono-50 tracking-tight">{activeVideo.title}</h3>
                <p class="text-xs text-mono-500 font-mono mt-1">
                  {t.playlist.videoLabel} {activeIndex + 1} {t.playlist.of} {videos.length}
                  {#if activeVideo.views}
                    • {activeVideo.views} {t.playlist.views}
                  {/if}
                </p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-4 flex flex-col">
            <div class="flex items-center justify-between pb-3 border-b border-mono-200 dark:border-mono-800 mb-4">
              <span class="text-[11px] uppercase tracking-[0.15em] font-mono font-medium text-mono-600 dark:text-mono-400 flex items-center gap-2">
                <ListVideo class="w-4 h-4 stroke-[1.75]" />
                {t.playlist.videoCount}
              </span>
              <span class="text-xs font-mono font-semibold text-mono-950 dark:text-mono-50">{videos.length}</span>
            </div>

            <div class="flex flex-col gap-2 overflow-y-auto max-h-[380px] pr-1">
              {#each videos as video, index}
                <button
                  onclick={() => activeIndex = index}
                  class={`w-full text-left p-3 border transition-colors flex items-center gap-3 ${
                    activeIndex === index
                      ? 'border-mono-950 dark:border-mono-50 bg-mono-100 dark:bg-mono-900 text-mono-950 dark:text-mono-50 font-medium'
                      : 'border-mono-200 dark:border-mono-800 text-mono-600 dark:text-mono-400 hover:border-mono-400 dark:hover:border-mono-600'
                  }`}
                >
                  <div class={`w-6 h-6 flex items-center justify-center text-xs shrink-0 ${
                    activeIndex === index ? 'bg-mono-950 dark:bg-mono-50 text-white dark:text-mono-950' : 'bg-mono-200 dark:bg-mono-800 text-mono-700 dark:text-mono-300'
                  }`}>
                    {#if activeIndex === index}
                      <Play class="w-3 h-3 fill-current" />
                    {:else}
                      <span class="font-mono text-[10px]">{index + 1}</span>
                    {/if}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs truncate">{video.title}</p>
                    {#if video.duration}
                      <span class="text-[10px] text-mono-500 font-mono mt-0.5 block">{video.duration}</span>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </div>
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
            href={siteConfig.youtube.channelUrl}
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
