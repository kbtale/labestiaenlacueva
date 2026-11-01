<script lang="ts">
  interface Props {
    label: string;
    icon?: 'arrow-down' | 'external' | 'copy' | 'arrow-right';
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
</script>

{#if href}
  <a
    {href}
    {target}
    {onclick}
    class="vault-capsule-button {className}"
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
    class="vault-capsule-button {className}"
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
    height: 42px;
    padding: 8px 58px 8px 20px;
    border: 0;
    outline: none;
    border-radius: 9999px;
    user-select: none;
    cursor: pointer;
    text-transform: uppercase;
    font-family: var(--font-ui);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #ffffff;
    background: transparent;
    overflow: hidden;
    transition: padding 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .vault-capsule-button:active {
    transform: scale(0.96);
  }

  .vault-capsule-button:hover {
    padding: 8px 76px 8px 16px;
  }

  .vault-capsule-backdrop {
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    pointer-events: none;
    transition: width 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                height 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                top 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                right 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                left 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                bottom 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                background-color 0.35s ease,
                box-shadow 0.35s ease;
  }

  .vault-capsule-button:hover .vault-capsule-backdrop {
    width: 28px;
    height: 28px;
    top: 7px;
    right: 7px;
    left: unset;
    bottom: unset;
    background: #ffffff;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.45);
  }

  .vault-capsule-label {
    position: relative;
    z-index: 5;
    white-space: nowrap;
    color: #ffffff;
    transition: color 0.3s ease;
  }

  .vault-capsule-orb-stage {
    position: absolute;
    top: 0;
    right: 0;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .vault-capsule-icon {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.32s ease,
                color 0.32s ease;
  }

  .vault-svg {
    width: 14px;
    height: 14px;
  }

  .vault-icon-primary {
    color: #ffffff;
    transform: translateX(0);
    opacity: 1;
  }

  .vault-capsule-button:hover .vault-icon-primary {
    transform: translateX(36px);
    opacity: 0;
  }

  .vault-icon-secondary {
    color: #000000;
    transform: translateX(-36px);
    opacity: 0;
  }

  .vault-capsule-button:hover .vault-icon-secondary {
    transform: translateX(0);
    opacity: 1;
  }
</style>
