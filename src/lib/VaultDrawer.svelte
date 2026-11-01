<script lang="ts">
  interface Props {
    open: boolean;
    title?: string;
    subtitle?: string;
    maxWidth?: string;
    onClose: () => void;
    onCloseStart?: () => void;
    header?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    open,
    title = '',
    subtitle = '',
    maxWidth = 'max-w-lg',
    onClose,
    onCloseStart,
    header,
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
    onCloseStart?.();
    isOpen = false;
    setTimeout(() => {
      onClose();
    }, 280);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      if (document.querySelector('.vault-player-panel')) {
        return;
      }
      handleClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isMounted}
  <div class="vault-drawer-overlay fixed inset-0 z-50 flex items-center justify-center sm:justify-start p-4 sm:p-6 sm:pl-10 md:pl-16 lg:pl-20 pointer-events-none">
    <button
      type="button"
      onclick={handleClose}
      aria-label="Cerrar modal"
      class="vault-drawer-backdrop fixed inset-0 w-full h-full bg-transparent cursor-default border-0 {isOpen ? 'pointer-events-auto' : 'pointer-events-none'}"
    ></button>

    <div
      role="dialog"
      aria-modal="true"
      class="vault-drawer-card relative z-10 w-full {maxWidth} bg-[#0c0d12]/98 rounded-2xl p-5 sm:p-7 border border-white/10 backdrop-blur-2xl flex flex-col gap-5 transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] {isOpen ? 'opacity-100 scale-100 translate-x-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-x-6 pointer-events-none'}"
    >
      <div class="flex items-center justify-between gap-4 pb-3.5 border-b border-white/5">
        {#if header}
          <div class="flex items-center min-w-0">
            {@render header()}
          </div>
        {:else if title || subtitle}
          <div class="flex flex-col min-w-0">
            {#if title}
              <span class="font-ui text-sm sm:text-base font-medium text-white/95 tracking-normal">
                {title}
              </span>
            {/if}
            {#if subtitle}
              <span class="font-ui text-sm text-neutral-300 font-medium mt-0.5 truncate">
                {subtitle}
              </span>
            {/if}
          </div>
        {:else}
          <div></div>
        {/if}

        <button
          type="button"
          onclick={handleClose}
          aria-label="Cerrar"
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-white text-white/70 hover:text-black flex items-center justify-center border-0 transition-all duration-300 hover:scale-105 active:scale-95 group cursor-pointer shrink-0 ml-auto"
        >
          <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="vault-drawer-body vault-scrollable text-neutral-300 text-sm leading-relaxed max-h-[68vh] overflow-y-auto overscroll-contain pr-1 scrollbar-thin [scrollbar-color:rgba(255,255,255,0.2)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {#if children}
          {@render children()}
        {/if}
      </div>
    </div>
  </div>
{/if}
