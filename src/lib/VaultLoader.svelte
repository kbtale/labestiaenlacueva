<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    progress: number;
    onComplete?: () => void;
    onStartIntro?: () => void;
  }

  let { progress, onComplete, onStartIntro }: Props = $props();

  let shown = $state(0);
  let isDone = $state(false);
  let isFading = $state(false);

  const ldEase = (x: number) =>
    x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  let s1 = $derived(ldEase(shown / 0.58));
  let s2 = $derived(ldEase((shown - 0.44) / 0.56));

  onMount(() => {
    let t0 = performance.now();
    let last = performance.now();
    let rafId = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const pace = Math.min(1, (now - t0) / 1400);
      const goal = Math.min(Math.max(progress, 0.05), pace);

      shown += (goal - shown) * (1 - Math.exp(-dt * 7));

      if ((progress >= 0.99 || pace >= 1) && (shown > 0.98 || (now - t0) > 2200)) {
        shown = 1;
        isFading = true;
        onStartIntro?.();
        setTimeout(() => {
          isDone = true;
          onComplete?.();
        }, 550);
        return;
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
    };
  });
</script>

{#if !isDone}
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0b] transition-all duration-700 ease-out {isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}"
  >
    <div class="relative w-28 h-28 flex items-center justify-center">
      <svg
        class="w-full h-full text-white"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M 22 80 L 50 20 L 78 80"
          pathLength="1"
          stroke-dasharray="1"
          stroke-dashoffset={Math.max(0, 1 - s1)}
          class="transition-[stroke-dashoffset] duration-75"
        />
        <path
          d="M 34 58 L 66 58"
          pathLength="1"
          stroke-dasharray="1"
          stroke-dashoffset={Math.max(0, 1 - s2)}
          class="transition-[stroke-dashoffset] duration-75"
        />
      </svg>
    </div>

    <div class="mt-4 flex flex-col items-center gap-1.5">
      <span class="font-display text-2xl text-white/90 tracking-wide">
        La Bestia en la Cueva
      </span>
      <span class="font-ui text-[11px] tracking-widest uppercase text-white/40">
        Iniciando Archivo
      </span>
    </div>
  </div>
{/if}
