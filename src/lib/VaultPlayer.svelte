<script lang="ts">
  import type { ArchiveItem } from './VaultEngine';
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';

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
  <div class="fixed inset-0 z-40 flex justify-end">
    <button
      type="button"
      onclick={onClose}
      class="fixed inset-0 w-full h-full bg-black/50 backdrop-blur-sm cursor-default transition-opacity"
      aria-label="Cerrar reproductor"
    ></button>

    <aside
      class="relative z-50 w-full sm:w-[580px] h-full bg-[#0d0e12]/92 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 ease-out"
    >
      <div>
        <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <span class="font-ui text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-white/90">
            {selectedItem.playlist}
          </span>

          <button
            onclick={onClose}
            aria-label="Cerrar panel"
            class="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
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

        <div class="p-6 sm:p-7 space-y-5">
          <div>
            <h2 class="font-ui text-xl sm:text-2xl font-semibold text-white leading-snug">
              {selectedItem.title}
            </h2>
            <p class="font-ui text-xs text-white/50 mt-1.5">
              {selectedItem.playlist}
            </p>
          </div>

          {#if selectedItem.tags && selectedItem.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 pt-1">
              {#each selectedItem.tags as tag}
                <span class="font-ui text-[11px] font-medium px-2.5 py-1 rounded-md bg-white/5 text-white/70 border border-white/5">
                  #{tag}
                </span>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <div class="p-6 sm:p-7 bg-[#0a0a0d]/80 flex flex-wrap items-center gap-3 border-0">
        <VaultCapsuleButton
          label="Abrir en YouTube"
          icon="external"
          variant="primary"
          href={`https://www.youtube.com/watch?v=${selectedItem.id}`}
          target="_blank"
        />

        <VaultCapsuleButton
          label="Copiar enlace"
          icon="copy"
          variant="secondary"
          onclick={copyLink}
          isSuccess={copied}
          successLabel="¡Enlace copiado!"
        />
      </div>
    </aside>
  </div>
{/if}
