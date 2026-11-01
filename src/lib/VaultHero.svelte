<script lang="ts">
  import VaultCapsuleButton from './VaultCapsuleButton.svelte';
  import { getLang, translations } from './i18n.svelte';

  interface Props {
    dist: number;
    onExplore?: () => void;
  }

  let { dist, onExplore }: Props = $props();

  let lang = $derived(getLang());
  let t = $derived(translations[lang].hero);

  let progress = $derived(Math.min(1, Math.max(0, dist / 85)));
  let heroOpacity = $derived(Math.pow(1 - progress, 2.2));
  let translateY = $derived(progress * 48);
  let isGone = $derived(progress >= 1);
</script>

<div
  class="fixed inset-x-0 bottom-0 pointer-events-none z-10 flex flex-col p-4 sm:p-10 will-change-transform"
  style="opacity: {heroOpacity.toFixed(3)}; transform: translate3d(0, {translateY.toFixed(1)}px, 0); visibility: {isGone ? 'hidden' : 'visible'};"
>
  <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 pb-2 sm:pb-8">
    <div class="max-w-md pointer-events-auto">
      <p class="font-body text-xs sm:text-base text-[#d4d4d8] leading-relaxed">
        {t.tagline}
      </p>
    </div>

    <div class="pointer-events-auto flex items-center">
      <VaultCapsuleButton
        label={t.exploreBtn}
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