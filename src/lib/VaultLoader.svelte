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
      const pace = Math.min(1, (now - t0) / 1600);
      const goal = Math.min(Math.max(progress, 0.05), pace);

      shown += (goal - shown) * (1 - Math.exp(-dt * 6.5));

      if ((progress >= 0.99 || pace >= 1) && (shown > 0.99 || (now - t0) > 1850)) {
        shown = 1;
        isFading = true;
        onStartIntro?.();
        setTimeout(() => {
          isDone = true;
          onComplete?.();
        }, 600);
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
    <div class="relative w-28 h-36 sm:w-32 sm:h-40 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] {isFading ? 'scale-105' : 'scale-100'}">
      <VaultCharacter
        progress={shown}
        class="w-full h-full text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300"
      />
    </div>

    <div class="mt-6 flex flex-col items-center gap-1.5">
      <span class="font-display text-2xl sm:text-3xl text-white/90 tracking-wide">
        La Bestia en la Cueva
      </span>
      <span class="font-ui text-[11px] tracking-widest uppercase text-white/40">
        Iniciando Archivo
      </span>
    </div>
  </div>
{/if}
