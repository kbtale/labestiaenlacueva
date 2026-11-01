<script lang="ts">
  import { onMount } from 'svelte';
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    hoveredItem: ArchiveItem | null;
    mousePos?: { x: number; y: number };
    activeRunwayItem?: ArchiveItem | null;
    dist?: number;
  }

  let {
    hoveredItem,
    mousePos = { x: 0, y: 0 },
    activeRunwayItem = null,
    dist = 0
  }: Props = $props();

  let isMobile = $state(false);

  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth <= 860 || ('ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });
</script>

{#if !isMobile && hoveredItem}
  <div
    class="fixed z-40 pointer-events-none transition-opacity duration-150"
    style="left: {mousePos.x}px; top: {mousePos.y}px; transform: translate(-50%, calc(-100% - 14px));"
  >
    <div class="flex items-center gap-2 bg-[#0c0d12]/92 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-ui whitespace-nowrap">
      <span class="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
        {hoveredItem.playlist}
      </span>
      <span class="text-white font-medium">
        {hoveredItem.title}
      </span>
    </div>
  </div>
{/if}

{#if isMobile && dist >= 30 && activeRunwayItem}
  <div
    class="fixed top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-[88vw]"
  >
    <div class="flex flex-col items-center text-center bg-[#0c0d12]/92 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
      <span class="text-[10px] uppercase tracking-wider font-semibold text-white/50 mb-0.5">
        {activeRunwayItem.playlist}
      </span>
      <span class="text-xs text-white font-medium line-clamp-1">
        {activeRunwayItem.title}
      </span>
    </div>
  </div>
{/if}
