<script lang="ts">
  interface Props {
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
  }

  let { activeFilter, onFilterChange }: Props = $props();

  const playlists = [
    { id: null, label: 'Todos' },
    { id: 'Vídeos que Pondría en un Museo', label: 'Vídeos que Pondría en un Museo' },
    { id: 'Vídeos de los que todos deberíamos estar hablando', label: 'Vídeos de los que todos deberíamos estar hablando' }
  ];

  const socials = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@LaBestiaenlaCueva',
      svg: '<path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>'
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/terminus',
      svg: '<path d="M18 6h0a14.5 14.5 0 0 0-4-1.2 11.8 11.8 0 0 0-.5 1.1 13.9 13.9 0 0 0-3 0 11.8 11.8 0 0 0-.5-1.1A14.5 14.5 0 0 0 6 6 15.3 15.3 0 0 0 3.5 17a14.7 14.7 0 0 0 4.5 2.3c.4-.5.7-1.1 1-1.7-.5-.2-1-.5-1.5-.8.1-.1.2-.2.3-.3a10.8 10.8 0 0 0 8.4 0c.1.1.2.2.3.3-.5.3-1 .6-1.5.8.3.6.6 1.2 1 1.7a14.7 14.7 0 0 0 4.5-2.3c.7-4.1-.3-8.2-2.5-11zM8.5 14c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z"/>'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@labestiaenlacueva',
      svg: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>'
    },
    {
      name: 'Kick',
      url: 'https://kick.com/bestiaelc',
      svg: '<path d="M4 3h5v6.5L14.5 3H20l-7 8.5 7.5 9.5h-5.5L9 14.5V21H4V3z"/>'
    },
    {
      name: 'Threads',
      url: 'https://www.threads.net/@carlosblacueva',
      svg: '<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm3.8 8.4a3.8 3.8 0 0 1-2 3.6 4.3 4.3 0 0 1-2.2.5 3.3 3.3 0 0 1-3.2-3.1 3.5 3.5 0 0 1 3.6-3.5c1.8 0 2.8 1 3 2.1l-1.3.4c-.2-.7-.8-1.2-1.7-1.2a2.2 2.2 0 0 0-2.3 2.2 2.1 2.1 0 0 0 2 2.1c.8 0 1.4-.4 1.8-1l-1.8-.8v-1.3h3.1z"/>'
    },
    {
      name: 'Pinterest',
      url: 'https://www.pinterest.com/labestiaenlacueva',
      svg: '<line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/><circle cx="12" cy="12" r="10"/>'
    }
  ];
</script>

<header class="fixed top-0 left-0 right-0 z-30 pointer-events-none p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div class="pointer-events-auto flex items-center gap-3">
    <h1 class="font-display text-2xl sm:text-3xl text-white tracking-wide hover:opacity-90 transition-opacity">
      La Bestia en la Cueva
    </h1>
  </div>

  <nav class="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-[#121316]/75 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10 shadow-lg overflow-x-auto max-w-full">
    {#each playlists as p}
      <button
        onclick={() => onFilterChange(p.id)}
        class="font-ui text-xs px-3 sm:px-4 py-1.5 rounded-full whitespace-nowrap transition-all duration-200 {activeFilter === p.id ? 'bg-white text-black font-semibold shadow' : 'text-[#a1a1aa] hover:text-white hover:bg-white/5'}"
      >
        {p.label}
      </button>
    {/each}
  </nav>

  <div class="pointer-events-auto hidden md:flex items-center gap-2 bg-[#121316]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
    {#each socials as s}
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={s.name}
        title={s.name}
        class="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-white/10 rounded-full transition-colors"
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
