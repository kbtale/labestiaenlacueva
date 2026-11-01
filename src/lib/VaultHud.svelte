<script lang="ts">
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    hoveredItem: ArchiveItem | null;
  }

  let { hoveredItem }: Props = $props();
</script>

<div
  class="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] {hoveredItem ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}"
>
  {#if hoveredItem}
    <div class="flex items-center gap-2.5 bg-[#0c0d12]/92 backdrop-blur-xl px-4 sm:px-5 py-2 rounded-full border border-white/10 max-w-[90vw] sm:max-w-xl">
      <span class="font-ui text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 shrink-0">
        {hoveredItem.playlist}
      </span>
      <span class="w-1 h-1 rounded-full bg-white/20 shrink-0 hidden sm:inline-block"></span>
      <span class="font-ui text-xs sm:text-sm text-white font-medium truncate">
        {hoveredItem.title}
      </span>
    </div>
  {/if}
</div>
