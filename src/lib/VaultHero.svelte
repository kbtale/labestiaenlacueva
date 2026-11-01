<script lang="ts">
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';

  interface Props {
    dist: number;
    onExplore?: () => void;
  }

  let { dist, onExplore }: Props = $props();

  let heroOpacity = $derived(Math.max(0, 1 - dist / 180));
  let isHidden = $derived(heroOpacity <= 0.005);
</script>

{#if !isHidden}
  <div
    class="fixed inset-x-0 bottom-0 pointer-events-none z-10 flex flex-col p-4 sm:p-10 transition-opacity duration-200"
    style="opacity: {heroOpacity};"
  >
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-2 sm:pb-8">
      <div class="max-w-md pointer-events-auto">
        <p class="font-body text-xs sm:text-base text-[#d4d4d8] leading-relaxed">
          Explora los gustos y disgustos, recomendaciones, reflexiones y todo aquello que he considerado valioso para compartir. Haz scroll para adentrarte en mi cueva.
        </p>
      </div>

      <div class="pointer-events-auto flex items-center">
        <VaultCapsuleButton
          label="Explorar colecciones"
          icon="arrow-down"
          onclick={onExplore}
          class="scale-90 origin-left sm:scale-100"
        />
      </div>
    </div>

    <div class="w-full text-center overflow-visible pt-1 sm:pt-4 pb-2 select-none pointer-events-none">
      <h1 class="font-display text-[clamp(2.6rem,11.5vw,13.5rem)] text-white/95 leading-[0.9] tracking-normal whitespace-nowrap">
        La Bestia en la Cueva
      </h1>
    </div>
  </div>
{/if}
