<script lang="ts">
  import { Video, ArrowUpRight, ExternalLink } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let posts = $derived(siteConfig.tiktok.posts);
</script>

<section id="tiktok" class="py-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800">
  <div class="max-w-6xl mx-auto">
    <div class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-mono-950 dark:text-mono-50">
          {t.tiktok.title}
        </h2>
      </div>

      <a
        href={siteConfig.tiktok.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-4 py-2 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-xs font-mono font-semibold uppercase tracking-wider text-mono-950 dark:text-mono-50 hover:border-mono-950 dark:hover:border-mono-50 transition-colors w-fit"
      >
        <span>{t.tiktok.btnProfile}</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
    </div>

    {#if posts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {#each posts as post}
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            class="group p-6 border border-mono-200 dark:border-mono-800 bg-mono-50/40 dark:bg-mono-900/40 hover:border-mono-950 dark:hover:border-mono-50 hover:bg-white dark:hover:bg-mono-900 transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                {#if post.tag}
                  <span class="text-[10px] uppercase tracking-wider font-mono font-medium px-2 py-0.5 border border-mono-300 dark:border-mono-800 bg-white dark:bg-mono-950 text-mono-700 dark:text-mono-300">
                    {post.tag}
                  </span>
                {/if}
                <ArrowUpRight class="w-4 h-4 text-mono-400 group-hover:text-mono-950 dark:group-hover:text-mono-50 transition-colors" />
              </div>
              <h3 class="text-sm font-semibold text-mono-950 dark:text-mono-50 leading-snug">
                {post.title}
              </h3>
            </div>

            <div class="mt-8 pt-4 border-t border-mono-200 dark:border-mono-800 flex items-center justify-between text-xs font-mono text-mono-500">
              <span>{t.tiktok.watch}</span>
              {#if post.views}
                <span>{post.views}</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="p-12 sm:p-16 border border-mono-200 dark:border-mono-800 bg-mono-50/50 dark:bg-mono-900/30 text-center">
        <div class="w-12 h-12 mx-auto border border-mono-300 dark:border-mono-800 bg-white dark:bg-mono-950 flex items-center justify-center text-mono-700 dark:text-mono-300 mb-4">
          <Video class="w-5 h-5 stroke-[1.75]" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-mono-950 dark:text-mono-50">
          {t.tiktok.emptyTitle}
        </h3>
        <div class="mt-6">
          <a
            href={siteConfig.tiktok.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors"
          >
            <span>{t.tiktok.btnProfile}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>
