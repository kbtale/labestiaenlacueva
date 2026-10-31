<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { VaultEngine, type ArchiveItem } from './VaultEngine';

  interface Props {
    activeFilter?: string | null;
    isDrawerOpen?: boolean;
    onHover?: (item: ArchiveItem | null) => void;
    onSelect?: (item: ArchiveItem) => void;
    onDistChange?: (dist: number) => void;
    onProgress?: (progress: number) => void;
  }

  let {
    activeFilter = null,
    isDrawerOpen = false,
    onHover,
    onSelect,
    onDistChange,
    onProgress
  }: Props = $props();

  let canvasEl: HTMLCanvasElement;
  let engine: VaultEngine | null = null;

  export function flyTo(target: number) {
    engine?.flyTo(target);
  }

  onMount(() => {
    engine = new VaultEngine(
      canvasEl,
      (item) => onHover?.(item),
      (item) => onSelect?.(item),
      (dist) => onDistChange?.(dist),
      (p) => onProgress?.(p)
    );
  });

  $effect(() => {
    if (engine) {
      engine.setFilter(activeFilter);
    }
  });

  $effect(() => {
    if (engine) {
      engine.setSoft(isDrawerOpen);
    }
  });

  onDestroy(() => {
    engine?.destroy();
  });
</script>

<canvas
  bind:this={canvasEl}
  class="fixed inset-0 w-full h-full block touch-none z-0 bg-[#0a0a0b]"
></canvas>
