<script lang="ts">
  import { Youtube, Video, Twitter, Github, Instagram, Mail, ArrowUpRight, ArrowDown, MessageSquare, Radio, AtSign, Pin } from 'lucide-svelte';
  import { getLang, translations } from './i18n.svelte';
  import { siteConfig } from './config';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);

  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'youtube': return Youtube;
      case 'discord': return MessageSquare;
      case 'tiktok': return Video;
      case 'kick': return Radio;
      case 'threads': return AtSign;
      case 'pinterest': return Pin;
      case 'x': return Twitter;
      case 'github': return Github;
      case 'instagram': return Instagram;
      default: return Mail;
    }
  };
</script>

<section id="about" class="pt-32 pb-20 px-6 sm:px-12 border-b border-mono-200 dark:border-mono-800">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-mono-950 dark:text-mono-50 leading-[1.05] max-w-5xl">
      {t.hero.title}
    </h1>

    <div class="mt-10 flex flex-wrap items-center gap-4">
      <a
        href="#playlist"
        class="inline-flex items-center gap-2.5 px-6 py-3 bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors"
      >
        <span>{t.hero.btnExplore}</span>
        <ArrowDown class="w-3.5 h-3.5" />
      </a>

      <a
        href="#contact"
        class="inline-flex items-center gap-2.5 px-6 py-3 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-950 dark:text-mono-50 font-mono text-xs uppercase tracking-wider font-semibold hover:border-mono-950 dark:hover:border-mono-50 transition-colors"
      >
        <span>{t.hero.btnContact}</span>
        <ArrowUpRight class="w-3.5 h-3.5" />
      </a>
    </div>

    <div class="mt-16 pt-10 border-t border-mono-200 dark:border-mono-800">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {#each siteConfig.socials as item}
          {@const IconComponent = getSocialIcon(item.id)}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            class="group p-4 border border-mono-200 dark:border-mono-800 bg-mono-50/50 dark:bg-mono-900/50 hover:border-mono-950 dark:hover:border-mono-50 hover:bg-white dark:hover:bg-mono-900 transition-all flex flex-col justify-between"
          >
            <div class="flex items-center justify-between text-mono-600 dark:text-mono-400 group-hover:text-mono-950 dark:group-hover:text-mono-50 mb-3 transition-colors">
              <IconComponent class="w-4 h-4 stroke-[1.75]" />
              <ArrowUpRight class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span class="text-xs font-semibold text-mono-950 dark:text-mono-50 block">{item.name}</span>
              <span class="text-[10px] font-mono text-mono-500 dark:text-mono-400 block truncate mt-0.5">{item.handle}</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>
