<script lang="ts">
  interface Props {
    label: string;
    icon?: 'arrow-down' | 'external' | 'copy' | 'arrow-right';
    variant?: 'primary' | 'secondary' | 'minimal';
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
    variant = 'primary',
    href,
    onclick,
    target,
    class: className = '',
    isSuccess = false,
    successLabel
  }: Props = $props();

  let activeLabel = $derived(isSuccess && successLabel ? successLabel : label);

  const baseStyles = 'group relative inline-flex items-center justify-center font-mono uppercase tracking-wider select-none border-0 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-95';

  const variantStyles = $derived(
    variant === 'primary'
      ? 'h-11 px-6 gap-3.5 rounded-full bg-white text-black font-bold text-xs shadow-[0_10px_30px_rgba(255,255,255,0.18)] hover:bg-[#eaeaea] hover:shadow-[0_15px_35px_rgba(255,255,255,0.3)]'
      : variant === 'secondary'
        ? 'h-10 px-5 gap-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-md'
        : 'h-9 px-2 gap-2 bg-transparent text-white/90 hover:text-white font-semibold text-xs'
  );

  const iconColor = $derived(
    variant === 'primary' ? 'text-black' : 'text-white'
  );
</script>

{#if href}
  <a
    {href}
    {target}
    {onclick}
    class="vault-capsule-button {baseStyles} {variantStyles} {className}"
  >
    <span class="vault-capsule-label relative z-10 whitespace-nowrap">
      {activeLabel}
    </span>

    <span class="vault-capsule-icon-stage relative w-4 h-4 flex items-center justify-center overflow-hidden shrink-0">
      {#if icon === 'arrow-down'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -top-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      {:else if icon === 'external'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 top-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      {:else if icon === 'copy'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      {:else}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
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
    class="vault-capsule-button {baseStyles} {variantStyles} {className}"
  >
    <span class="vault-capsule-label relative z-10 whitespace-nowrap">
      {activeLabel}
    </span>

    <span class="vault-capsule-icon-stage relative w-4 h-4 flex items-center justify-center overflow-hidden shrink-0">
      {#if icon === 'arrow-down'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -top-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-y-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      {:else if icon === 'external'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 top-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      {:else if icon === 'copy'}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      {:else}
        <svg
          class="w-3.5 h-3.5 {iconColor} transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        <svg
          class="w-3.5 h-3.5 absolute -left-5 {iconColor} opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu group-hover:translate-x-5 group-hover:opacity-100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
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
