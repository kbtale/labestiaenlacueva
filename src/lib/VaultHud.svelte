<script lang="ts">
  import type { ArchiveItem } from './VaultEngine';

  interface Props {
    hoveredItem: ArchiveItem | null;
  }

  let { hoveredItem }: Props = $props();
</script>

<div
  class="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300 ease-out {hoveredItem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}"
>
  {#if hoveredItem}
    <div class="flex flex-col items-center text-center bg-[#0d0e11]/85 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/10 shadow-2xl max-w-[85vw] sm:max-w-md">
      <span class="font-ui text-sm sm:text-base font-medium text-[#ededed] leading-snug line-clamp-1">
        {hoveredItem.title}
      </span>
      <span class="font-ui text-xs text-[#ededed]/45 tracking-wide mt-0.5">
        {hoveredItem.playlist}
      </span>
    </div>
  {/if}
</div>
