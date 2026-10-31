<script lang="ts">
  interface Props {
    label: string;
    icon?: 'arrow-down' | 'external' | 'copy' | 'arrow-right';
    href?: string;
    onclick?: (e: MouseEvent) => void;
    target?: string;
    class?: string;
    isSuccess?: boolean;
    successLabel?: string;
  }

  let {
    label,
    icon = 'arrow-down',
    href,
    onclick,
    target,
    class: className = '',
    isSuccess = false,
    successLabel
  }: Props = $props();

  let activeLabel = $derived(isSuccess && successLabel ? successLabel : label);
</script>

{#if href}
  <a
    {href}
    {target}
    {onclick}
    class="vault-capsule-button group relative inline-flex items-center justify-between h-10 px-5 pr-12 rounded-full overflow-hidden text-xs font-mono tracking-widest uppercase text-white/90 hover:text-white transition-colors duration-200 select-none {className}"
  >
    <span
      class="vault-capsule-backdrop absolute inset-0 rounded-full bg-[#14151a] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-7 group-hover:h-7 group-hover:right-1.5 group-hover:top-1.5 group-hover:left-auto group-hover:bottom-auto group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
    ></span>

    <span class="vault-capsule-label relative z-10 whitespace-nowrap">
      {activeLabel}
    </span>

    <span class="vault-capsule-icon-stage absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
      {#if icon === 'arrow-down'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -top-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      {:else if icon === 'external'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 bottom-[-24px] text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      {:else if icon === 'copy'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      {:else}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      {/if}
    </span>
  </a>
{:else}
  <button
    type="button"
    {onclick}
    class="vault-capsule-button group relative inline-flex items-center justify-between h-10 px-5 pr-12 rounded-full overflow-hidden text-xs font-mono tracking-widest uppercase text-white/90 hover:text-white transition-colors duration-200 select-none bg-transparent border-0 cursor-pointer active:scale-95 {className}"
  >
    <span
      class="vault-capsule-backdrop absolute inset-0 rounded-full bg-[#14151a] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-7 group-hover:h-7 group-hover:right-1.5 group-hover:top-1.5 group-hover:left-auto group-hover:bottom-auto group-hover:bg-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
    ></span>

    <span class="vault-capsule-label relative z-10 whitespace-nowrap">
      {activeLabel}
    </span>

    <span class="vault-capsule-icon-stage absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
      {#if icon === 'arrow-down'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -top-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      {:else if icon === 'external'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 bottom-[-24px] text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:-translate-y-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      {:else if icon === 'copy'}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      {:else}
        <svg
          class="w-3.5 h-3.5 text-white/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-6 text-black opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-6 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      {/if}
    </span>
  </button>
{/if}
