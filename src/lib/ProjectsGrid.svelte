<script lang="ts">
  import { Github, ExternalLink, FolderGit2 } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  let projects = $derived(siteConfig.projects);
  let githubUrl = $derived(siteConfig.socials.find(s => s.id === 'github')?.url || 'https://github.com');
</script>

<section id="projects" class="py-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800 bg-mono-50/50 dark:bg-mono-900/30">
  <div class="max-w-6xl mx-auto">
    <div class="mb-8">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-mono-950 dark:text-mono-50">
        {t.projects.title}
      </h2>
    </div>

    {#if projects.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as item}
          <div class="p-6 border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 flex flex-col justify-between hover:border-mono-950 dark:hover:border-mono-50 transition-colors">
            <div>
              <div class="flex flex-wrap gap-1.5 mb-4">
                {#each item.tags as tag}
                  <span class="text-[10px] uppercase font-mono px-2 py-0.5 border border-mono-200 dark:border-mono-800 text-mono-600 dark:text-mono-400">
                    {tag}
                  </span>
                {/each}
              </div>

              <h3 class="text-lg font-bold text-mono-950 dark:text-mono-50 tracking-tight">
                {item.title}
              </h3>

              <p class="mt-2 text-xs sm:text-sm text-mono-600 dark:text-mono-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div class="mt-8 pt-4 border-t border-mono-200 dark:border-mono-800 flex items-center justify-between">
              {#if item.githubUrl}
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-mono-600 dark:text-mono-400 hover:text-mono-950 dark:hover:text-mono-50 transition-colors"
                >
                  <Github class="w-3.5 h-3.5 stroke-[1.75]" />
                  <span>{t.projects.sourceCode}</span>
                </a>
              {:else}
                <div></div>
              {/if}

              {#if item.liveUrl}
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-xs font-mono font-semibold text-mono-950 dark:text-mono-50 hover:border-mono-950 dark:hover:border-mono-50 transition-colors"
                >
                  <span>{t.projects.liveProject}</span>
                  <ExternalLink class="w-3 h-3 stroke-[1.75]" />
                </a>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="p-12 sm:p-16 border border-mono-200 dark:border-mono-800 bg-white dark:bg-mono-950 text-center">
        <div class="w-12 h-12 mx-auto border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 flex items-center justify-center text-mono-700 dark:text-mono-300 mb-4">
          <FolderGit2 class="w-5 h-5 stroke-[1.75]" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-mono-950 dark:text-mono-50">
          {t.projects.emptyTitle}
        </h3>
        <div class="mt-6">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors"
          >
            <Github class="w-3.5 h-3.5 stroke-[1.75]" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    {/if}
  </div>
</section>
