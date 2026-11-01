<script lang="ts">
  interface Props {
    label: string;
    onclick?: () => void;
    href?: string;
    target?: string;
    class?: string;
  }

  let {
    label,
    onclick,
    href,
    target,
    class: className = ''
  }: Props = $props();

  const chars = $derived(Array.from(label));
</script>

{#if href}
  <a
    {href}
    {target}
    {onclick}
    aria-label={label}
    class="vault-roll-link group relative inline-flex items-center text-[11px] sm:text-[13px] font-bold tracking-[0.08em] sm:tracking-[0.16em] uppercase font-ui text-neutral-300 hover:text-white transition-colors duration-200 select-none {className}"
  >
    <span class="inline-flex overflow-hidden h-[1.3em] leading-[1.3em]">
      {#each chars as char, i}
        {#if char === ' '}
          <span class="inline-block w-[0.35em]">&nbsp;</span>
        {:else}
          <span class="vault-roll-char relative inline-flex flex-col">
            <span
              class="inline-block transform-gpu transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
              style="transition-delay: {i * 18}ms;"
            >
              {char}
            </span>
            <span
              class="absolute top-full left-0 inline-block transform-gpu transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-white"
              style="transition-delay: {i * 18}ms;"
            >
              {char}
            </span>
          </span>
        {/if}
      {/each}
    </span>
  </a>
{:else}
  <button
    type="button"
    {onclick}
    aria-label={label}
    class="vault-roll-link group relative inline-flex items-center text-[11px] sm:text-[13px] font-bold tracking-[0.08em] sm:tracking-[0.16em] uppercase font-ui text-neutral-300 hover:text-white transition-colors duration-200 select-none bg-transparent border-0 p-0 cursor-pointer {className}"
  >
    <span class="inline-flex overflow-hidden h-[1.3em] leading-[1.3em]">
      {#each chars as char, i}
        {#if char === ' '}
          <span class="inline-block w-[0.35em]">&nbsp;</span>
        {:else}
          <span class="vault-roll-char relative inline-flex flex-col">
            <span
              class="inline-block transform-gpu transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full"
              style="transition-delay: {i * 18}ms;"
            >
              {char}
            </span>
            <span
              class="absolute top-full left-0 inline-block transform-gpu transition-transform duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full text-white"
              style="transition-delay: {i * 18}ms;"
            >
              {char}
            </span>
          </span>
        {/if}
      {/each}
    </span>
  </button>
{/if}
