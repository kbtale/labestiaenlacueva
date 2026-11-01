<script lang="ts">
  import { onMount } from 'svelte';
  import VaultRollLink from './VaultRollLink.svelte';
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';
  import VaultDrawer from './VaultDrawer.svelte';
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    activeFilter?: string | null;
    dist?: number;
    onFilterChange?: (filter: string | null) => void;
    onRewind?: () => void;
    onExplore?: () => void;
    onSelectVideo?: (video: ArchiveItem) => void;
  }

  let {
    activeFilter = null,
    dist = 0,
    onRewind,
    onExplore,
    onSelectVideo
  }: Props = $props();

  let activeModal = $state<'about' | 'socials' | 'contact' | 'sections' | null>(null);
  let archiveItems = $state<ArchiveItem[]>([]);
  let selectedSection = $state<string>('Vídeos que Pondría en un Museo');
  let isDropdownOpen = $state(false);

  const isAtRest = $derived(dist < 30);

  const sectionKeys = [
    'Vídeos que Pondría en un Museo',
    'Vídeos de los que todos deberíamos estar hablando'
  ];

  let filteredVideos = $derived(
    archiveItems.filter(v => v.playlist === selectedSection)
  );

  onMount(async () => {
    try {
      const res = await fetch('/data/archive.json');
      const data = await res.json();
      archiveItems = data.entries || [];
    } catch {}
  });

  function pickVideo(video: ArchiveItem) {
    onSelectVideo?.(video);
  }

  const socials = [
    {
      name: 'YouTube',
      handle: '@LaBestiaenlaCueva',
      url: 'https://www.youtube.com/@LaBestiaenlaCueva',
      svg: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
    },
    {
      name: 'Discord',
      handle: 'La Cueva / Términus',
      url: 'https://discord.gg/terminus',
      svg: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
    },
    {
      name: 'TikTok',
      handle: '@labestiaenlacueva',
      url: 'https://www.tiktok.com/@labestiaenlacueva',
      svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.75 1.04-.04 2.02-.59 2.59-1.45.45-.64.63-1.43.62-2.22l.03-17.71z"/>'
    },
    {
      name: 'Kick',
      handle: 'bestiaelc',
      url: 'https://kick.com/bestiaelc',
      svg: '<path d="M1.333 0h8v5.333h2.667V2.667h2.667V0h8v8h-2.667v2.667h-2.667v2.666h2.667V16h2.667v8h-8v-2.667h-2.667v-2.666H9.333V24h-8V0zm8 8h-2.666v8h2.666V8z"/>'
    },
    {
      name: 'Threads',
      handle: '@carlosblacueva',
      url: 'https://www.threads.net/@carlosblacueva',
      svg: '<path d="M12.186 24h-.007C5.46 23.978 0 18.675 0 12.176 0 5.428 5.46.022 12.179.022c6.498 0 11.821 5.406 11.821 12.154 0 4.195-2.062 7.742-5.518 9.489-.522.264-1.157.05-1.421-.472-.264-.523-.051-1.158.471-1.422 2.87-1.45 4.584-4.385 4.584-7.85 0-5.66-4.46-10.27-9.937-10.27-5.66 0-10.27 4.46-10.27 9.937 0 5.66 4.46 10.27 9.937 10.27.18 0 .36-.005.54-.015 1.583-.086 2.984-.71 3.948-1.758.125-.137.234-.282.327-.433.094.045.188.09.283.132.483.213.722.766.509 1.25-.213.483-.766.721-1.25.508-.184-.082-.366-.172-.544-.27-.887.892-2.096 1.458-3.483 1.57-.282.023-.567.034-.852.034z"/>'
    }
  ];
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape' && isDropdownOpen) {
      isDropdownOpen = false;
      e.stopPropagation();
    }
  }}
  onclick={(e) => {
    if (isDropdownOpen) {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.vault-dropdown-container')) {
        isDropdownOpen = false;
      }
    }
  }}
/>

<header class="vault-nav-header fixed top-0 left-0 right-0 z-30 pointer-events-none p-6 sm:p-8 flex items-center justify-center min-h-[72px] sm:min-h-[80px]">
  <nav
    class="vault-brand-menu flex items-center gap-6 sm:gap-9 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-5 scale-[0.96] pointer-events-none'}"
  >
    <VaultRollLink label="Mis secciones" onclick={() => activeModal = 'sections'} />
    <VaultRollLink label="Sobre mí" onclick={() => activeModal = 'about'} />
    <VaultRollLink label="Mis redes" onclick={() => activeModal = 'socials'} />
    <VaultRollLink label="Contacto" onclick={() => activeModal = 'contact'} />
  </nav>
</header>

<div
  class="fixed top-5 left-5 z-30 flex sm:hidden items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}"
>
  <VaultCapsuleButton
    label="Volver"
    icon="rewind"
    onclick={onRewind}
  />
</div>

<div
  class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}"
>
  <VaultCapsuleButton
    label="Volver"
    icon="rewind"
    onclick={onRewind}
  />
</div>

{#snippet sectionsHeader()}
  <div class="relative vault-dropdown-container">
    <button
      type="button"
      onclick={() => (isDropdownOpen = !isDropdownOpen)}
      class="vault-dropdown-trigger flex items-center gap-3 pl-4 pr-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/25 text-white transition-all duration-300 group cursor-pointer"
      aria-haspopup="listbox"
      aria-expanded={isDropdownOpen}
    >
      <span class="flex items-center gap-2 min-w-0">
        <span class="w-1.5 h-1.5 rounded-full bg-white/80 group-hover:scale-125 transition-transform shrink-0"></span>
        <span class="font-ui text-xs font-medium text-white/95 max-w-[210px] sm:max-w-[340px] truncate">
          {selectedSection}
        </span>
      </span>
      <span class="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 text-white/80 group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0 {isDropdownOpen ? 'rotate-180 bg-white text-black group-hover:bg-white group-hover:text-black' : ''}">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>

    {#if isDropdownOpen}
      <div
        class="absolute left-0 top-[calc(100%+8px)] w-72 sm:w-88 bg-[#0d0e13]/98 backdrop-blur-2xl rounded-2xl p-1.5 border border-white/15 shadow-2xl z-30 flex flex-col gap-1 transition-all duration-200"
        role="listbox"
      >
        {#each sectionKeys as key}
          <button
            type="button"
            onclick={() => { selectedSection = key; isDropdownOpen = false; }}
            role="option"
            aria-selected={selectedSection === key}
            class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-ui text-xs transition-all duration-200 border-0 cursor-pointer {selectedSection === key ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-300 hover:bg-white/10 hover:text-white font-medium'}"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="w-1.5 h-1.5 rounded-full shrink-0 {selectedSection === key ? 'bg-black' : 'bg-white/30'}"></span>
              <span class="truncate">{key}</span>
            </div>
            <span class="font-ui text-[11px] {selectedSection === key ? 'text-black/70' : 'text-neutral-400'} shrink-0 ml-3">
              {archiveItems.filter(v => v.playlist === key).length}
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<VaultDrawer
  open={activeModal === 'sections'}
  maxWidth="max-w-2xl"
  onClose={() => { activeModal = null; isDropdownOpen = false; }}
  header={sectionsHeader}
>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
    {#each filteredVideos as v}
      <button
        type="button"
        onclick={() => pickVideo(v)}
        class="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left border border-white/5 hover:border-white/20 group cursor-pointer"
      >
        <img
          src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
          alt={v.title}
          class="w-20 h-13 object-cover rounded-md shrink-0 bg-black/50"
          loading="lazy"
        />
        <div class="flex flex-col min-w-0">
          <span class="font-ui text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-white">
            {v.title}
          </span>
          {#if v.tags && v.tags.length > 0}
            <span class="font-ui text-[10px] text-neutral-400 mt-1">
              #{v.tags[0]}
            </span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'about'}
  title="Sobre mí / Manifiesto"
  onClose={() => activeModal = null}
>
  <div class="space-y-4 font-ui text-xs text-neutral-300 leading-relaxed">
    <p class="text-sm font-semibold text-white">
      La Bestia en la Cueva — Archivo de Crítica Visual y Cinematográfica
    </p>
    <p class="font-body text-sm text-neutral-300 leading-relaxed">
      Este espacio es un archivo vivo de reflexiones visuales, arte, filosofía y cine. Investigamos las obras y debates que desafían el ruido contemporáneo para rescatar el peso de la imagen y la fuerza del lenguaje cinematográfico.
    </p>
    <div class="p-4 rounded-xl bg-white/5 space-y-2 border border-white/5">
      <div class="text-[11px] uppercase tracking-widest text-neutral-400 font-ui font-semibold">Colecciones Principales</div>
      <ul class="list-disc list-inside space-y-1 text-neutral-300">
        <li>Vídeos que Pondría en un Museo — Piezas selectas de trascendencia visual y conceptual.</li>
        <li>Vídeos de los que todos deberíamos estar hablando — Debates y obras contemporáneas urgentes.</li>
      </ul>
    </div>
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'socials'}
  title="Redes y Comunidad"
  onClose={() => activeModal = null}
>
  <div class="grid grid-cols-1 gap-2.5 font-ui">
    {#each socials as soc}
      <a
        href={soc.url}
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 text-neutral-200 hover:text-white group"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/80 group-hover:text-white">
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              {@html soc.svg}
            </svg>
          </div>
          <div>
            <div class="text-xs font-semibold text-white">{soc.name}</div>
            <div class="text-[11px] text-neutral-400">{soc.handle}</div>
          </div>
        </div>
        <svg class="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </a>
    {/each}
  </div>
</VaultDrawer>

<VaultDrawer
  open={activeModal === 'contact'}
  title="Contacto"
  onClose={() => activeModal = null}
>
  <form
    onsubmit={(e) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const name = (form.elements.namedItem('name') as HTMLInputElement)?.value || '';
      const subject = (form.elements.namedItem('subject') as HTMLInputElement)?.value || 'Contacto desde la web';
      const msg = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '';
      const body = encodeURIComponent(`De: ${name}\n\n${msg}`);
      window.location.href = `mailto:labestiaelc@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    }}
    class="space-y-4 font-ui text-xs"
  >
    <div class="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
      <div>
        <div class="text-[10px] uppercase tracking-wider text-neutral-400 font-ui font-semibold">Destinatario</div>
        <div class="text-white text-xs select-all font-medium mt-0.5">labestiaelc@gmail.com</div>
      </div>
      <button
        type="button"
        onclick={() => navigator.clipboard?.writeText('labestiaelc@gmail.com')}
        class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-ui text-[11px] transition-colors border-0 cursor-pointer"
      >
        Copiar correo
      </button>
    </div>

    <div class="space-y-1.5">
      <label for="contact-name" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">Nombre o alias</label>
      <input
        id="contact-name"
        name="name"
        type="text"
        required
        placeholder="Tu nombre"
        class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>

    <div class="space-y-1.5">
      <label for="contact-subject" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">Asunto</label>
      <input
        id="contact-subject"
        name="subject"
        type="text"
        required
        placeholder="Propuesta, colaboración, comentario..."
        class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>

    <div class="space-y-1.5">
      <label for="contact-message" class="text-[11px] text-neutral-400 uppercase tracking-wider font-medium">Mensaje</label>
      <textarea
        id="contact-message"
        name="message"
        rows="4"
        required
        placeholder="Escribe tu mensaje aquí..."
        class="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full py-3 rounded-full bg-white text-black font-ui font-semibold text-xs hover:bg-white/90 active:scale-[0.99] transition-all border-0 cursor-pointer"
    >
      Enviar mensaje
    </button>
  </form>
</VaultDrawer>
