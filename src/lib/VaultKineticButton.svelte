<script lang="ts">
  interface Props {
    label: string;
    icon?: 'external' | 'copy' | 'arrow-right' | 'arrow-down';
    href?: string;
    onclick?: (e: MouseEvent) => void;
    target?: string;
    class?: string;
    isSuccess?: boolean;
    successLabel?: string;
  }

  let {
    label,
    icon = 'external',
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
    class="vault-kinetic-button {className}"
  >
    <span class="vault-kinetic-arrows">
      <span class="vault-kinetic-icon">
        {#if isSuccess}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>

      <span class="vault-kinetic-icon">
        {#if isSuccess}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </span>

    <span class="vault-kinetic-label">
      {activeLabel}
    </span>

    <span class="vault-kinetic-line"></span>
  </a>
{:else}
  <button
    type="button"
    {onclick}
    class="vault-kinetic-button {className}"
  >
    <span class="vault-kinetic-arrows">
      <span class="vault-kinetic-icon">
        {#if isSuccess}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>

      <span class="vault-kinetic-icon">
        {#if isSuccess}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        {:else if icon === 'external'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        {:else if icon === 'copy'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        {:else if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </span>

    <span class="vault-kinetic-label">
      {activeLabel}
    </span>

    <span class="vault-kinetic-line"></span>
  </button>
{/if}

<style>
  .vault-kinetic-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    padding: 4px 38px 4px 0;
    border: 0;
    outline: none;
    user-select: none;
    cursor: pointer;
    text-decoration: none;
    background: transparent;
    font-family: var(--font-ui);
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: #ffffff;
    overflow: hidden;
    transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .vault-kinetic-button:active {
    transform: scale(0.96);
  }

  .vault-kinetic-button:hover {
    padding: 4px 0 4px 38px;
  }

  .vault-kinetic-arrows {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -38px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;
    transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .vault-kinetic-button:hover .vault-kinetic-arrows {
    left: 0;
    right: -38px;
  }

  .vault-kinetic-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #ffffff;
    flex-shrink: 0;
  }

  .vault-svg {
    width: 14px;
    height: 14px;
  }

  .vault-kinetic-label {
    position: relative;
    z-index: 2;
    white-space: nowrap;
    color: #ffffff;
    transition: color 0.3s ease;
  }

  .vault-kinetic-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0;
    background: #ffffff;
    pointer-events: none;
    transition: width 0.38s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .vault-kinetic-button:hover .vault-kinetic-line {
    width: 100%;
  }
</style>
