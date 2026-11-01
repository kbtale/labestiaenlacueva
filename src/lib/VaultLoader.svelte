<script lang="ts">
  import { onMount } from 'svelte';
  import VaultCharacter from './VaultCharacter.svelte';

  interface Props {
    progress: number;
    onComplete?: () => void;
    onStartIntro?: () => void;
  }

  let { progress, onComplete, onStartIntro }: Props = $props();

  let shown = $state(0);
  let isDone = $state(false);
  let isFading = $state(false);

  onMount(() => {
    let t0 = performance.now();
    let last = performance.now();
    let rafId = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.25, (now - last) / 1000);
      last = now;
      const pace = Math.min(1, (now - t0) / 2200);
      const goal = Math.min(Math.max(progress, 0.05), pace);

      shown += (goal - shown) * (1 - Math.exp(-dt * 6.0));

      if (pace >= 1 && (shown > 0.985 || (now - t0) > 2600)) {
        shown = 1;
        isFading = true;
        onStartIntro?.();
        setTimeout(() => {
          isDone = true;
          onComplete?.();
        }, 500);
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
    <div class="relative w-32 h-40 sm:w-36 sm:h-44 flex items-center justify-center">
      <VaultCharacter
        progress={shown}
        class="w-full h-full text-white transition-all duration-300"
      />
    </div>

    <div class="mt-6 flex flex-col items-center gap-1.5">
      <span class="font-display text-4xl sm:text-5xl text-white/90 tracking-normal">
        La Bestia en la Cueva
      </span>
      <span class="font-ui text-[11px] tracking-widest uppercase text-white/40">
        Iniciando Archivo
      </span>
    </div>
  </div>
{/if}
