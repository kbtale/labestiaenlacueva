<script lang="ts">
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    selectedItem: ArchiveItem | null;
    onClose: () => void;
  }

  let { selectedItem, onClose }: Props = $props();

  let copied = $state(false);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }

  async function copyLink() {
    if (!selectedItem) return;
    const url = `https://www.youtube.com/watch?v=${selectedItem.id}`;
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

{#if selectedItem}
  <div class="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md transition-opacity">
    <button
      type="button"
      onclick={onClose}
      class="absolute inset-0 w-full h-full cursor-default"
      aria-label="Cerrar modal"
    ></button>

    <div
      class="relative z-10 w-full max-w-4xl bg-[#101114] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#16171c]">
        <div class="flex items-center gap-3 overflow-hidden">
          <span class="font-ui text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90 whitespace-nowrap">
            {selectedItem.playlist}
          </span>
          <h2 class="font-ui text-sm sm:text-base font-medium text-white truncate">
            {selectedItem.title}
          </h2>
        </div>
        <button
          onclick={onClose}
          aria-label="Cerrar"
          class="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-2"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="relative w-full aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${selectedItem.id}?autoplay=1&rel=0&modestbranding=1`}
          title={selectedItem.title}
          class="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>

      <div class="p-5 sm:p-6 overflow-y-auto space-y-4">
        <div>
          <h3 class="font-ui text-lg sm:text-xl font-semibold text-white leading-snug">
            {selectedItem.title}
          </h3>
          <p class="font-ui text-xs text-white/50 mt-1">
            {selectedItem.playlist}
          </p>
        </div>

        {#if selectedItem.tags && selectedItem.tags.length > 0}
          <div class="flex flex-wrap gap-1.5 pt-1">
            {#each selectedItem.tags as tag}
              <span class="font-ui text-[11px] font-medium px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/5">
                #{tag}
              </span>
            {/each}
          </div>
        {/if}

        <div class="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
          <a
            href={`https://www.youtube.com/watch?v=${selectedItem.id}`}
            target="_blank"
            rel="noopener noreferrer"
            class="font-ui text-xs font-semibold px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2"
          >
            <span>Abrir en YouTube</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>

          <button
            onclick={copyLink}
            class="font-ui text-xs font-medium px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors flex items-center gap-2"
          >
            <span>{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
