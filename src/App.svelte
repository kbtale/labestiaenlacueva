<script lang="ts">
  import Navbar from './lib/Navbar.svelte';
  import Hero from './lib/Hero.svelte';
  import YoutubePlaylist from './lib/YoutubePlaylist.svelte';
  import TiktokGrid from './lib/TiktokGrid.svelte';
  import ProjectsGrid from './lib/ProjectsGrid.svelte';
  import Contact from './lib/Contact.svelte';
  import { getLang, translations } from './lib/i18n.svelte';

  let lang = $derived(getLang());
  let t = $derived(translations[lang]);
</script>

<div class="min-h-screen bg-white dark:bg-mono-950 text-mono-950 dark:text-mono-50 transition-colors duration-200">
  <Navbar />
  
  <main class="w-full">
    <Hero />
    <YoutubePlaylist />
    <TiktokGrid />
    <ProjectsGrid />
    <Contact />
  </main>

  <footer class="py-12 px-6 sm:px-12 border-t border-mono-200 dark:border-mono-800 bg-mono-50 dark:bg-mono-950 text-mono-600 dark:text-mono-400 text-xs">
    <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <span class="tracking-wider uppercase font-mono text-[11px] font-medium text-mono-700 dark:text-mono-300">
        © 2026 LA BESTIA EN LA CUEVA. {t.footer.rights}
      </span>
      <span class="font-mono text-[11px] uppercase tracking-widest text-mono-500 dark:text-mono-400">
        {t.footer.stack}
      </span>
    </div>
  </footer>
</div>
