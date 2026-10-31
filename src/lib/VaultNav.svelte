<script lang="ts">
  import VaultRollLink from './VaultRollLink.svelte';
  import VaultDrawer from './VaultDrawer.svelte';

  interface Props {
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
    dist?: number;
    onRewind?: () => void;
    onExplore?: () => void;
  }

  let {
    activeFilter,
    onFilterChange,
    dist = 0,
    onRewind,
    onExplore
  }: Props = $props();

  let activeModal = $state<'about' | 'socials' | 'contact' | null>(null);

  const isAtRest = $derived(dist < 30);

  const playlists = [
    { id: null, label: 'Todos' },
    { id: 'Vídeos que Pondría en un Museo', label: 'Vídeos que Pondría en un Museo' },
    { id: 'Vídeos de los que todos deberíamos estar hablando', label: 'Vídeos de los que todos deberíamos estar hablando' }
  ];

  const socials = [
    {
      name: 'YouTube',
      handle: '@LaBestiaenlaCueva',
      url: 'https://www.youtube.com/@LaBestiaenlaCueva',
      svg: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>'
    },
    {
      name: 'Discord',
      handle: 'Comunidad Terminus',
      url: 'https://discord.gg/terminus',
      svg: '<path d="M18 6h0a14.5 14.5 0 0 0-4-1.2 11.8 11.8 0 0 0-.5 1.1 13.9 13.9 0 0 0-3 0 11.8 11.8 0 0 0-.5-1.1A14.5 14.5 0 0 0 6 6 15.3 15.3 0 0 0 3.5 17a14.7 14.7 0 0 0 4.5 2.3c.4-.5.7-1.1 1-1.7-.5-.2-1-.5-1.5-.8.1-.1.2-.2.3-.3a10.8 10.8 0 0 0 8.4 0c.1.1.2.2.3.3-.5.3-1 .6-1.5.8.3.6.6 1.2 1 1.7a14.7 14.7 0 0 0 4.5-2.3c.7-4.1-.3-8.2-2.5-11zM8.5 14c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>'
    },
    {
      name: 'TikTok',
      handle: '@labestiaenlacueva',
      url: 'https://www.tiktok.com/@labestiaenlacueva',
      svg: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>'
    },
    {
      name: 'Kick',
      handle: 'bestiaelc',
      url: 'https://kick.com/bestiaelc',
      svg: '<path d="M4 3h5v6.5L14.5 3H20l-7 8.5 7.5 9.5h-5.5L9 14.5V21H4V3z"/>'
    },
    {
      name: 'Threads',
      handle: '@carlosblacueva',
      url: 'https://www.threads.net/@carlosblacueva',
      svg: '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 8.4a3.8 3.8 0 0 1-2 3.6 4.3 4.3 0 0 1-2.2.5 3.3 3.3 0 0 1-3.2-3.1 3.5 3.5 0 0 1 3.6-3.5c1.8 0 2.8 1 3 2.1l-1.3.4c-.2-.7-.8-1.2-1.7-1.2a2.2 2.2 0 0 0-2.3 2.2 2.1 2.1 0 0 0 2 2.1c.8 0 1.4-.4 1.8-1l-1.8-.8v-1.3h3.1z"/>'
    },
    {
      name: 'Pinterest',
      handle: 'labestiaenlacueva',
      url: 'https://www.pinterest.com/labestiaenlacueva',
      svg: '<line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/><circle cx="12" cy="12" r="10"/>'
    }
  ];
</script>

<header class="vault-nav-header fixed top-0 left-0 right-0 z-30 pointer-events-none p-6 sm:p-8 flex items-center justify-between gap-4">
  <div class="pointer-events-auto flex items-center gap-3">
    <a
      href="/"
      aria-label="La Bestia en la Cueva"
      class="vault-nav-brand w-9 h-9 rounded-full bg-[#16171c]/90 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all shadow-md group"
    >
      <svg class="w-5 h-5 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 14a3 3 0 0 0 6 0" />
      </svg>
    </a>

    {#if !isAtRest}
      <button
        onclick={onRewind}
        class="vault-nav-rewind font-mono text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#16171c]/95 text-white/90 hover:text-white backdrop-blur-md transition-all duration-300 shadow-lg flex items-center gap-1.5 animate-in fade-in zoom-in-95 cursor-pointer"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Volver</span>
      </button>
    {/if}
  </div>

  <div class="relative flex items-center justify-center min-w-[280px]">
    <nav
      class="vault-brand-menu pointer-events-auto flex items-center gap-5 sm:gap-7 bg-[#121316]/90 backdrop-blur-xl px-6 py-2.5 rounded-full shadow-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none absolute'}"
    >
      <VaultRollLink label="Mis secciones" onclick={onExplore} />
      <VaultRollLink label="Sobre mí" onclick={() => activeModal = 'about'} />
      <VaultRollLink label="Mis redes" onclick={() => activeModal = 'socials'} />
      <VaultRollLink label="Contacto" onclick={() => activeModal = 'contact'} />
    </nav>

    <nav
      class="vault-filter-bar pointer-events-auto flex items-center gap-1 sm:gap-1.5 bg-[#121316]/95 backdrop-blur-xl px-2 py-1.5 rounded-full shadow-xl overflow-x-auto max-w-[70vw] sm:max-w-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-0 translate-y-2 scale-95 pointer-events-none absolute' : 'opacity-100 translate-y-0 scale-100'}"
    >
      {#each playlists as p}
        <button
          onclick={() => onFilterChange(p.id)}
          class="vault-filter-pill font-mono text-xs px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer {activeFilter === p.id ? 'bg-white text-black font-semibold shadow' : 'text-neutral-400 hover:text-white hover:bg-white/5'}"
        >
          {p.label}
        </button>
      {/each}
    </nav>
  </div>

  <div class="pointer-events-auto hidden md:flex items-center gap-2 bg-[#121316]/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xl">
    {#each socials as s}
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.name}
        title={s.name}
        class="vault-social-link p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
      >
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {@html s.svg}
        </svg>
      </a>
    {/each}
  </div>
</header>

<VaultDrawer
  open={activeModal === 'about'}
  title="Sobre mí / Manifiesto"
  onClose={() => activeModal = null}
>
  <div class="space-y-4 font-mono text-xs text-neutral-300 leading-relaxed">
    <p class="text-sm font-semibold text-white">
      La Bestia en la Cueva — Archivo de Crítica Visual y Cinematográfica
    </p>
    <p>
      Este espacio es un archivo vivo de reflexiones visuales, arte, filosofía y cine. Investigamos las obras y debates que desafían el ruido contemporáneo para rescatar el peso de la imagen y la fuerza del lenguaje cinematográfico.
    </p>
    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
      <div class="text-[11px] uppercase tracking-widest text-neutral-400">Colecciones Principales</div>
      <div class="text-white">1. Vídeos que Pondría en un Museo</div>
      <div class="text-white">2. Vídeos de los que todos deberíamos estar hablando</div>
    </div>
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'socials'}
  title="Mis Redes Oficiales"
  onClose={() => activeModal = null}
>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {#each socials as s}
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-neutral-200 hover:text-white group"
      >
        <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            {@html s.svg}
          </svg>
        </span>
        <span class="flex flex-col">
          <span class="font-mono text-xs font-semibold text-white">{s.name}</span>
          <span class="font-mono text-[10px] text-neutral-400">{s.handle}</span>
        </span>
      </a>
    {/each}
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'contact'}
  title="Contacto y Colaboraciones"
  onClose={() => activeModal = null}
>
  <div class="space-y-4 font-mono text-xs text-neutral-300">
    <p>
      Para propuestas editoriales, proyectos audiovisuales, curaduría o charlas críticas, puedes comunicarte por los siguientes canales directos:
    </p>
    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
      <div>
        <div class="text-[10px] uppercase tracking-wider text-neutral-400">Correo Electrónico</div>
        <div class="text-white text-sm font-semibold select-all">contacto@labestiaenlacueva.com</div>
      </div>
      <a
        href="mailto:contacto@labestiaenlacueva.com"
        class="px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-[11px] hover:bg-white/90 transition-colors"
      >
        Escribir
      </a>
    </div>
    <p class="text-[11px] text-neutral-400">
      También puedes contactar directamente a través del servidor oficial de Discord.
    </p>
  </div>
</VaultDrawer>
