<script lang="ts">
  interface Props {
    label: string;
    icon?: 'arrow-down' | 'external' | 'copy' | 'arrow-right' | 'rewind';
    href?: string;
    onclick?: (e: MouseEvent) => void;
    target?: string;
    class?: string;
  }

  let {
    label,
    icon = 'arrow-down',
    href,
    onclick,
    target,
    class: className = ''
  }: Props = $props();

  let isHovered = $state(false);
</script>

{#if href}
  <a
    {href}
    {target}
    {onclick}
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    class="vault-capsule-button {className}"
    class:hovered={isHovered}
  >
    <span class="vault-capsule-backdrop"></span>

    <span class="vault-capsule-label">
      {label}
    </span>

    <span class="vault-capsule-orb-stage">
      <span class="vault-capsule-icon vault-icon-primary">
        {#if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
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
        {:else if icon === 'rewind'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>

      <span class="vault-capsule-icon vault-icon-secondary">
        {#if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
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
        {:else if icon === 'rewind'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </span>
  </a>
{:else}
  <button
    type="button"
    {onclick}
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
    class="vault-capsule-button {className}"
    class:hovered={isHovered}
  >
    <span class="vault-capsule-backdrop"></span>

    <span class="vault-capsule-label">
      {label}
    </span>

    <span class="vault-capsule-orb-stage">
      <span class="vault-capsule-icon vault-icon-primary">
        {#if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
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
        {:else if icon === 'rewind'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>

      <span class="vault-capsule-icon vault-icon-secondary">
        {#if icon === 'arrow-down'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
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
        {:else if icon === 'rewind'}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        {:else}
          <svg class="vault-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        {/if}
      </span>
    </span>
  </button>
{/if}

<style>
  .vault-capsule-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    padding: 10px 58px 10px 24px;
    border: 0;
    outline: none;
    border-radius: 9999px;
    user-select: none;
    cursor: pointer;
    text-decoration: none;
    text-transform: none;
    font-family: var(--font-ui);
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: #000000;
    background: transparent;
    transition: padding 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .vault-capsule-button:active {
    transform: scale(0.96);
  }

  .vault-capsule-button:hover,
  .vault-capsule-button.hovered {
    padding: 10px 72px 10px 18px;
  }

  .vault-capsule-backdrop {
    position: absolute;
    top: 6px;
    right: 6px;
    height: calc(100% - 12px);
    width: calc(100% - 12px);
    border-radius: 9999px;
    background: #ffffff;
    pointer-events: none;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.16);
    transition: width 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                box-shadow 0.35s ease;
  }

  .vault-capsule-button:hover .vault-capsule-backdrop,
  .vault-capsule-button.hovered .vault-capsule-backdrop {
    width: 34px;
    box-shadow: 0 0 24px rgba(255, 255, 255, 0.45);
  }

  .vault-capsule-label {
    position: relative;
    z-index: 5;
    white-space: nowrap;
    color: #000000;
    transition: color 0.32s ease;
  }

  .vault-capsule-button:hover .vault-capsule-label,
  .vault-capsule-button.hovered .vault-capsule-label {
    color: #ffffff;
  }

  .vault-capsule-orb-stage {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
    border-radius: 50%;
  }

  .vault-capsule-icon {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #000000;
    transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.32s ease;
  }

  .vault-svg {
    width: 15px;
    height: 15px;
  }

  .vault-icon-primary {
    transform: translateX(0);
    opacity: 1;
  }

  .vault-capsule-button:hover .vault-icon-primary,
  .vault-capsule-button.hovered .vault-icon-primary {
    transform: translateX(36px);
    opacity: 0;
  }

  .vault-icon-secondary {
    transform: translateX(-36px);
    opacity: 0;
  }

  .vault-capsule-button:hover .vault-icon-secondary,
  .vault-capsule-button.hovered .vault-icon-secondary {
    transform: translateX(0);
    opacity: 1;
  }
</style>
