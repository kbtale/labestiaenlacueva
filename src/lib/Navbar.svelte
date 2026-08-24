<script lang="ts">
  import { Menu, X, Sun, Moon, Globe } from 'lucide-svelte';
  import { getLang, toggleLang, translations } from './i18n.svelte';
  import { getTheme, toggleTheme } from './theme.svelte';

  let isMobileOpen = $state(false);

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);
  let theme = $derived(getTheme());

  const navLinks = $derived([
    { name: t.nav.about, href: '#about' },
    { name: t.nav.playlist, href: '#playlist' },
    { name: t.nav.tiktok, href: '#tiktok' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.contact, href: '#contact' },
  ]);
</script>

<header class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 bg-white/80 dark:bg-mono-950/80 backdrop-blur-md border-b border-mono-200 dark:border-mono-800 transition-colors">
  <div class="max-w-6xl mx-auto flex items-center justify-between">
    <a href="#about" class="flex items-center gap-2.5 text-mono-950 dark:text-mono-50 hover:opacity-75 transition-opacity">
      <div class="w-5 h-5 bg-mono-950 dark:bg-mono-50 flex items-center justify-center">
        <div class="w-2 h-2 bg-white dark:bg-mono-950"></div>
      </div>
      <span class="font-mono text-xs tracking-[0.18em] uppercase font-bold text-mono-950 dark:text-mono-50">
        {t.nav.brand}
      </span>
    </a>

    <nav class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <a
          href={link.href}
          class="font-mono text-[11px] uppercase tracking-[0.14em] text-mono-500 hover:text-mono-950 dark:text-mono-400 dark:hover:text-mono-50 transition-colors"
        >
          {link.name}
        </a>
      {/each}
    </nav>

    <div class="hidden md:flex items-center gap-3">
      <button
        onclick={toggleLang}
        class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-medium border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100 hover:border-mono-950 dark:hover:border-mono-50 transition-colors"
        aria-label="Cambiar idioma"
      >
        <Globe class="w-3 h-3 stroke-[1.75]" />
        <span>{lang.toUpperCase()}</span>
      </button>

      <button
        onclick={toggleTheme}
        class="p-1.5 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100 hover:border-mono-950 dark:hover:border-mono-50 transition-colors"
        aria-label="Cambiar tema claro u oscuro"
      >
        {#if theme === 'dark'}
          <Sun class="w-3.5 h-3.5 stroke-[1.75]" />
        {:else}
          <Moon class="w-3.5 h-3.5 stroke-[1.75]" />
        {/if}
      </button>

      <a
        href="#contact"
        class="text-[11px] font-mono uppercase tracking-wider font-semibold bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 px-4 py-1.5 hover:bg-mono-800 dark:hover:bg-mono-200 transition-colors"
      >
        {t.nav.getInTouch}
      </a>
    </div>

    <div class="flex items-center gap-2 md:hidden">
      <button
        onclick={toggleLang}
        class="px-2 py-1 text-[10px] font-mono font-medium border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100"
      >
        {lang.toUpperCase()}
      </button>

      <button
        onclick={toggleTheme}
        class="p-1 border border-mono-300 dark:border-mono-800 bg-mono-50 dark:bg-mono-900 text-mono-900 dark:text-mono-100"
      >
        {#if theme === 'dark'}
          <Sun class="w-3.5 h-3.5 stroke-[1.75]" />
        {:else}
          <Moon class="w-3.5 h-3.5 stroke-[1.75]" />
        {/if}
      </button>

      <button
        onclick={() => isMobileOpen = !isMobileOpen}
        class="p-1 text-mono-900 dark:text-mono-100"
        aria-label="Menu"
      >
        {#if isMobileOpen}
          <X class="w-5 h-5" />
        {:else}
          <Menu class="w-5 h-5" />
        {/if}
      </button>
    </div>
  </div>

  {#if isMobileOpen}
    <div class="md:hidden border-t border-mono-200 dark:border-mono-800 mt-3 pt-3 pb-2 flex flex-col gap-3">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={() => isMobileOpen = false}
          class="font-mono text-xs uppercase tracking-wider text-mono-900 dark:text-mono-100 py-1"
        >
          {link.name}
        </a>
      {/each}
      <a
        href="#contact"
        onclick={() => isMobileOpen = false}
        class="mt-2 text-center text-xs font-mono uppercase tracking-wider font-semibold bg-mono-950 text-mono-50 dark:bg-mono-50 dark:text-mono-950 py-2"
      >
        {t.nav.getInTouch}
      </a>
    </div>
  {/if}
</header>
