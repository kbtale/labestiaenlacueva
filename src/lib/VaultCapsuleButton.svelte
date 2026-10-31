<script lang="ts">
  interface Props {
    label: string;
    icon?: 'arrow-down' | 'external' | 'copy' | 'arrow-right';
    variant?: 'solid' | 'primary' | 'secondary';
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
    variant = 'solid',
    href,
    onclick,
    target,
    class: className = '',
    isSuccess = false,
    successLabel
  }: Props = $props();

  let activeLabel = $derived(isSuccess && successLabel ? successLabel : label);
  const isMorphing = $derived(variant === 'primary' || variant === 'secondary');
</script>

{#if !isMorphing}
  {#if href}
    <a
      {href}
      {target}
      {onclick}
      class="vault-capsule-button solid {className}"
    >
      <span class="vault-capsule-label">
        {activeLabel}
      </span>

      <span class="vault-capsule-icon-inline">
        {#if icon === 'arrow-down'}
          <svg class="vault-icon-svg vault-glide-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-icon-svg vault-glide-diag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-icon-svg vault-glide-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else}
          <svg class="vault-icon-svg vault-glide-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
      class="vault-capsule-button solid {className}"
    >
      <span class="vault-capsule-label">
        {activeLabel}
      </span>

      <span class="vault-capsule-icon-inline">
        {#if icon === 'arrow-down'}
          <svg class="vault-icon-svg vault-glide-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-icon-svg vault-glide-diag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-icon-svg vault-glide-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else}
          <svg class="vault-icon-svg vault-glide-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </button>
  {/if}
{:else}
  {#if href}
    <a
      {href}
      {target}
      {onclick}
      class="vault-capsule-button morphing {variant === 'primary' ? 'morphing-primary' : 'morphing-secondary'} {className}"
    >
      <span class="vault-capsule-backdrop"></span>

      <span class="vault-capsule-label">
        {activeLabel}
      </span>

      <span class="vault-capsule-icon-stage">
        {#if icon === 'arrow-down'}
          <svg class="vault-icon-svg vault-icon-primary vault-down-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-down-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-icon-svg vault-icon-primary vault-diag-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-diag-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-icon-svg vault-icon-primary vault-right-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-right-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else}
          <svg class="vault-icon-svg vault-icon-primary vault-right-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-right-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
      class="vault-capsule-button morphing {variant === 'primary' ? 'morphing-primary' : 'morphing-secondary'} {className}"
    >
      <span class="vault-capsule-backdrop"></span>

      <span class="vault-capsule-label">
        {activeLabel}
      </span>

      <span class="vault-capsule-icon-stage">
        {#if icon === 'arrow-down'}
          <svg class="vault-icon-svg vault-icon-primary vault-down-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-down-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-icon-svg vault-icon-primary vault-diag-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-diag-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-icon-svg vault-icon-primary vault-right-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-right-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else}
          <svg class="vault-icon-svg vault-icon-primary vault-right-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          <svg class="vault-icon-svg vault-icon-secondary vault-right-in" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </button>
  {/if}
{/if}

<style>
  .vault-capsule-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    border: 0;
    outline: none;
    border-radius: 9999px;
    user-select: none;
    cursor: pointer;
    text-transform: uppercase;
    font-family: var(--font-ui);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .vault-capsule-button:active {
    transform: scale(0.96);
  }

  .vault-capsule-button.solid {
    height: 40px;
    padding: 0 20px;
    gap: 12px;
    justify-content: center;
    background: #ffffff;
    color: #000000;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.05em;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.18);
    transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  }
  .vault-capsule-button.solid:hover {
    background: #eaeaea;
    box-shadow: 0 15px 35px rgba(255, 255, 255, 0.3);
  }

  .vault-capsule-button.morphing {
    height: 40px;
    padding: 0 48px 0 20px;
    justify-content: space-between;
    background: transparent;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.05em;
  }

  .vault-capsule-backdrop {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    border-radius: 9999px;
    border: 0;
    pointer-events: none;
    transition: width 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                height 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                top 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                right 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                background-color 0.3s ease,
                box-shadow 0.3s ease;
  }

  .vault-capsule-button.morphing-primary .vault-capsule-backdrop {
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.18);
  }
  .vault-capsule-button.morphing-primary:hover .vault-capsule-backdrop {
    width: 28px;
    height: 28px;
    top: 6px;
    right: 6px;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.45);
  }

  .vault-capsule-button.morphing-secondary .vault-capsule-backdrop {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .vault-capsule-button.morphing-secondary:hover .vault-capsule-backdrop {
    width: 28px;
    height: 28px;
    top: 6px;
    right: 6px;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.45);
  }

  .vault-capsule-label {
    position: relative;
    z-index: 10;
    white-space: nowrap;
    transition: color 0.3s ease;
  }
  .vault-capsule-button.morphing-primary .vault-capsule-label {
    color: #000000;
  }
  .vault-capsule-button.morphing-primary:hover .vault-capsule-label {
    color: #ffffff;
  }
  .vault-capsule-button.morphing-secondary .vault-capsule-label {
    color: rgba(255, 255, 255, 0.9);
  }
  .vault-capsule-button.morphing-secondary:hover .vault-capsule-label {
    color: #ffffff;
  }

  .vault-capsule-icon-inline {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .vault-capsule-icon-stage {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
  }

  .vault-icon-svg {
    width: 14px;
    height: 14px;
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                color 0.3s ease;
  }

  .vault-capsule-button.solid .vault-icon-svg {
    color: #000000;
  }
  .vault-capsule-button.solid:hover .vault-glide-down {
    transform: translateY(4px);
  }
  .vault-capsule-button.solid:hover .vault-glide-right {
    transform: translateX(4px);
  }
  .vault-capsule-button.solid:hover .vault-glide-diag {
    transform: translate(3px, -3px);
  }

  .vault-capsule-button.morphing-primary .vault-icon-svg {
    color: #000000;
  }
  .vault-capsule-button.morphing-secondary .vault-icon-svg {
    color: #ffffff;
  }
  .vault-capsule-button.morphing-secondary:hover .vault-icon-svg {
    color: #000000;
  }

  .vault-icon-secondary {
    position: absolute;
    opacity: 0;
  }

  .vault-capsule-button.morphing:hover .vault-down-out {
    transform: translateY(24px);
    opacity: 0;
  }
  .vault-down-in {
    top: -24px;
  }
  .vault-capsule-button.morphing:hover .vault-down-in {
    transform: translateY(24px);
    opacity: 1;
  }

  .vault-capsule-button.morphing:hover .vault-diag-out {
    transform: translate(24px, -24px);
    opacity: 0;
  }
  .vault-diag-in {
    left: -24px;
    bottom: -24px;
  }
  .vault-capsule-button.morphing:hover .vault-diag-in {
    transform: translate(24px, -24px);
    opacity: 1;
  }

  .vault-capsule-button.morphing:hover .vault-right-out {
    transform: translateX(24px);
    opacity: 0;
  }
  .vault-right-in {
    left: -24px;
  }
  .vault-capsule-button.morphing:hover .vault-right-in {
    transform: translateX(24px);
    opacity: 1;
  }
</style>
