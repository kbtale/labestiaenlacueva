<script lang="ts">
  interface Props {
    open: boolean;
    title: string;
    onClose: () => void;
    children?: import('svelte').Snippet;
  }

  let { open, title, onClose, children }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && open) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <div class="vault-drawer-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
    <button
      type="button"
      onclick={onClose}
      aria-label="Cerrar modal"
      class="vault-drawer-backdrop fixed inset-0 w-full h-full bg-black/60 backdrop-blur-md cursor-default border-0"
    ></button>

    <div
      role="dialog"
      aria-modal="true"
      class="vault-drawer-card relative z-10 w-full max-w-lg bg-[#0e0f14]/95 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col gap-6 animate-in zoom-in-95 duration-200"
    >
      <div class="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
          {title}
        </h3>
        <button
          type="button"
          onclick={onClose}
          aria-label="Cerrar"
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10 transition-colors"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="vault-drawer-body text-neutral-300 text-sm leading-relaxed">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}
