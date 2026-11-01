<script lang="ts">
  interface Props {
    open: boolean;
    title: string;
    subtitle?: string;
    maxWidth?: string;
    onClose: () => void;
    children?: import('svelte').Snippet;
  }

  let {
    open,
    title,
    subtitle,
    maxWidth = 'max-w-lg',
    onClose,
    children
  }: Props = $props();

  let isMounted = $state(false);
  let isOpen = $state(false);

  $effect(() => {
    if (open) {
      isMounted = true;
      requestAnimationFrame(() => {
        isOpen = true;
      });
    } else {
      isOpen = false;
      const timer = setTimeout(() => {
        isMounted = false;
      }, 350);
      return () => clearTimeout(timer);
    }
  });

  function handleClose() {
    isOpen = false;
    setTimeout(() => {
      onClose();
    }, 320);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isMounted}
  <div class="vault-drawer-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
    <button
      type="button"
      onclick={handleClose}
      aria-label="Cerrar modal"
      class="vault-drawer-backdrop fixed inset-0 w-full h-full bg-black/70 backdrop-blur-md cursor-default border-0 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"
    ></button>

    <div
      role="dialog"
      aria-modal="true"
      class="vault-drawer-card relative z-10 w-full {maxWidth} bg-[#0c0d12]/98 rounded-2xl p-6 sm:p-8 border border-white/10 backdrop-blur-2xl flex flex-col gap-6 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] {isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 translate-y-3 pointer-events-none'}"
    >
      <div class="flex items-center justify-between pb-3 border-b border-white/5">
        <div class="flex flex-col">
          <span class="font-ui text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            {title}
          </span>
          {#if subtitle}
            <span class="font-ui text-sm text-neutral-300 font-medium mt-0.5">
              {subtitle}
            </span>
          {/if}
        </div>

        <button
          type="button"
          onclick={handleClose}
          aria-label="Cerrar"
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-white text-white/70 hover:text-black flex items-center justify-center border-0 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer shrink-0"
        >
          <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="vault-drawer-body text-neutral-300 text-sm leading-relaxed max-h-[75vh] overflow-y-auto pr-1">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}
