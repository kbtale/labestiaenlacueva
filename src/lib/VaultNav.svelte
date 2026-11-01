<script lang="ts">
  import VaultRollLink from './VaultRollLink.svelte';
  import VaultDrawer from './VaultDrawer.svelte';
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';

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
      svg: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
    },
    {
      name: 'Discord',
      handle: 'Comunidad Terminus',
      url: 'https://discord.gg/terminus',
      svg: '<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>'
    },
    {
      name: 'TikTok',
      handle: '@labestiaenlacueva',
      url: 'https://www.tiktok.com/@labestiaenlacueva',
      svg: '<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>'
    },
    {
      name: 'Kick',
      handle: 'bestiaelc',
      url: 'https://kick.com/bestiaelc',
      svg: '<path d="M1.333 0v24h5.333v-6.667h2.667L14.667 24h6.666l-7.333-9.333L21.333 0h-6.666l-5.334 7.333H6.667V0H1.333z"/>'
    },
    {
      name: 'Threads',
      handle: '@carlosblacueva',
      url: 'https://www.threads.net/@carlosblacueva',
      svg: '<path d="M12.186 24c-.007 0-.014 0-.02 0-3.278-.016-6.008-1.17-8.113-3.428-2.065-2.214-3.16-5.184-3.167-8.587-.008-3.425 1.082-6.402 3.151-8.608C6.143 1.129 8.877-.016 12.183 0h.015c3.315.016 6.042 1.159 8.106 3.398 2.066 2.241 3.157 5.228 3.155 8.635v.068c-.008 1.488-.25 2.91-.718 4.228-.62 1.745-1.579 3.208-2.85 4.348-1.554 1.393-3.52 2.128-5.845 2.184-.047 0-.094 0-.142 0-2.274 0-4.24-.717-5.688-2.072-1.392-1.303-2.182-3.07-2.285-5.111l-.004-.153c0-2.08.775-3.87 2.241-5.176 1.408-1.254 3.342-1.944 5.592-1.996h.224c1.688 0 3.22.42 4.432 1.214.398.261.642.7.653 1.176.012.476-.21.928-.593 1.21-.692.51-1.555.263-2.38.077-.665-.15-1.424-.226-2.235-.226-1.545.036-2.856.495-3.791 1.328-.888.791-1.365 1.884-1.343 3.078.066 1.314.577 2.454 1.478 3.297.986.922 2.378 1.398 4.025 1.376 1.637-.04 3.018-.54 4.103-1.488.94-.821 1.62-1.897 2.022-3.197.352-.988.533-2.057.538-3.178.002-2.73-.839-5.1-2.433-6.852-1.646-1.808-3.864-2.73-6.59-2.743h-.012c-2.716.013-4.93 1.05-6.574 3.08-1.603 1.979-2.443 4.606-2.436 7.6.006 2.973.856 5.584 2.457 7.55 1.638 2.012 3.844 3.036 6.556 3.049h.016c2.25-.01 4.116-.708 5.545-2.074.453-.434 1.164-.424 1.604.022.44.445.434 1.16-.01 1.6-1.782 1.704-4.104 2.584-6.897 2.6z"/>'
    },
    {
      name: 'Pinterest',
      handle: 'labestiaenlacueva',
      url: 'https://www.pinterest.com/labestiaenlacueva',
      svg: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.02 0 1.513.77 1.513 1.694 0 1.028-.654 2.563-.99 3.987-.283 1.192.599 2.162 1.777 2.162 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.627 0 11.983-5.373 11.983-12S18.644 0 12.017 0z"/>'
    }
  ];
</script>

<header class="vault-nav-header fixed top-0 left-0 right-0 z-30 pointer-events-none p-6 sm:p-8 flex items-center justify-center min-h-[72px] sm:min-h-[80px]">
  <nav
    class="vault-brand-menu pointer-events-auto flex items-center gap-6 sm:gap-9 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}"
  >
    <VaultRollLink label="Mis secciones" onclick={onExplore} />
    <VaultRollLink label="Sobre mí" onclick={() => activeModal = 'about'} />
    <VaultRollLink label="Mis redes" onclick={() => activeModal = 'socials'} />
    <VaultRollLink label="Contacto" onclick={() => activeModal = 'contact'} />
  </nav>
</header>

<div
  class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] {isAtRest ? 'opacity-0 translate-y-12 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto'}"
>
  <VaultCapsuleButton
    label="Volver"
    icon="rewind"
    onclick={onRewind}
  />
</div>

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
    <div class="p-4 rounded-2xl bg-white/5 space-y-2 border-0">
      <div class="text-[11px] uppercase tracking-widest text-neutral-400 font-ui font-semibold">Colecciones Principales</div>
      <div class="text-white font-ui text-xs">1. Vídeos que Pondría en un Museo</div>
      <div class="text-white font-ui text-xs">2. Vídeos de los que todos deberíamos estar hablando</div>
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
        class="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-neutral-200 hover:text-white group border-0"
      >
        <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 group-hover:text-white">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
            {@html s.svg}
          </svg>
        </span>
        <span class="flex flex-col">
          <span class="font-ui text-xs font-semibold text-white">{s.name}</span>
          <span class="font-ui text-[10px] text-neutral-400">{s.handle}</span>
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
  <div class="space-y-4 font-ui text-xs text-neutral-300">
    <p class="font-body text-sm leading-relaxed text-neutral-300">
      Para propuestas editoriales, proyectos audiovisuales, curaduría o charlas críticas, puedes comunicarte por los siguientes canales directos:
    </p>
    <div class="p-4 rounded-2xl bg-white/5 flex items-center justify-between border-0">
      <div>
        <div class="text-[10px] uppercase tracking-wider text-neutral-400 font-ui">Correo Electrónico</div>
        <div class="text-white text-sm font-semibold select-all font-ui">contacto@labestiaenlacueva.com</div>
      </div>
      <a
        href="mailto:contacto@labestiaenlacueva.com"
        class="px-3.5 py-1.5 rounded-full bg-white text-black font-ui font-semibold text-[11px] hover:bg-white/90 transition-colors border-0"
      >
        Escribir
      </a>
    </div>
    <p class="text-[11px] text-neutral-400 font-ui">
      También puedes contactar directamente a través del servidor oficial de Discord.
    </p>
  </div>
</VaultDrawer>
