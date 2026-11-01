<script lang="ts">
  import type { ArchiveItem } from './VaultEngine';
  import VaultKineticButton from './VaultKineticButton.svelte';

  interface Props {
    selectedItem: ArchiveItem | null;
    onClose: () => void;
  }

  let { selectedItem, onClose }: Props = $props();

  let activeItem = $state<ArchiveItem | null>(null);
  let isOpen = $state(false);
  let copied = $state(false);

  $effect(() => {
    if (selectedItem) {
      activeItem = selectedItem;
      requestAnimationFrame(() => {
        isOpen = true;
      });
    } else {
      isOpen = false;
      const timer = setTimeout(() => {
        activeItem = null;
      }, 420);
      return () => clearTimeout(timer);
    }
  });

  function handleClose() {
    isOpen = false;
    setTimeout(() => {
      onClose();
    }, 400);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      e.stopPropagation();
      handleClose();
    }
  }

  async function copyLink() {
    if (!activeItem) return;
    const url = `https://www.youtube.com/watch?v=${activeItem.id}`;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch {}
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if activeItem}
  <div class="fixed inset-0 z-[65] flex justify-end pointer-events-none">
    <button
      type="button"
      onclick={handleClose}
      class="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm cursor-default border-0 transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] {isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"
      aria-label="Cerrar reproductor"
    ></button>

    <aside
      class="vault-player-panel relative z-[70] w-full sm:w-[580px] h-full bg-[#0d0e12]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] {isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'}"
    >
      <div>
        <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span class="font-ui text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90">
            {activeItem.playlist}
          </span>

          <button
            type="button"
            onclick={handleClose}
            aria-label="Cerrar panel"
            class="vault-player-close group relative w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white/80 hover:text-black flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 border-0 shadow-lg cursor-pointer"
          >
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeItem.id}?autoplay=1&rel=0&modestbranding=1`}
            title={activeItem.title}
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div class="p-6 sm:p-7 space-y-5">
          <div>
            <h2 class="font-ui text-xl sm:text-2xl font-semibold text-white leading-snug">
              {activeItem.title}
            </h2>
            <p class="font-ui text-xs text-white/50 mt-1.5">
              {activeItem.playlist}
            </p>
          </div>

          {#if activeItem.tags && activeItem.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each activeItem.tags as tag}
                <span class="font-ui text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/5 text-white/70 border border-white/5">
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div class="sticky bottom-0 z-20 p-6 sm:p-7 bg-[#0a0a0d]/95 backdrop-blur-xl flex flex-wrap items-center gap-6 border-0">
        <VaultKineticButton
          label="Abrir en YouTube"
          icon="external"
          href={`https://www.youtube.com/watch?v=${activeItem.id}`}
          target="_blank"
        />

        <VaultKineticButton
          label="Copiar enlace"
          icon="copy"
          onclick={copyLink}
          isSuccess={copied}
          successLabel="¡Enlace copiado!"
        />
      </div>
    </aside>
  </div>
{/if}
