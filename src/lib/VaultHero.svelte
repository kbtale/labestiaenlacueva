<script lang="ts">
  interface Props {
    dist: number;
  }

  let { dist }: Props = $props();

  let heroOpacity = $derived(Math.max(0, 1 - dist / 180));
  let isHidden = $derived(heroOpacity <= 0.005);
</script>

{#if !isHidden}
  <div
    class="fixed inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-10 transition-opacity duration-200"
    style="opacity: {heroOpacity};"
  >
    <div class="h-14"></div>

    <div class="flex items-end justify-between gap-6 pb-4 sm:pb-8">
      <div class="max-w-md pointer-events-auto">
        <p class="font-body text-sm sm:text-base text-[#d4d4d8] leading-relaxed">
          Reflexiones visuales, cine, arte y filosofía. Un archivo de obras y debates que desafían el ruido contemporáneo. Haz scroll para adentrarte en la cueva.
        </p>
      </div>
    </div>

    <div class="w-full text-center overflow-hidden pb-1 sm:pb-2 select-none pointer-events-none">
      <h1 class="font-display text-[clamp(3.8rem,10.5vw,11.5rem)] text-white/95 leading-[0.8] tracking-tight whitespace-nowrap drop-shadow-2xl">
        La Bestia en la Cueva
      </h1>
    </div>
  </div>
{/if}
