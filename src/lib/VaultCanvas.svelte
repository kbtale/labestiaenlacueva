<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { VaultEngine, type ArchiveItem } from './VaultEngine';

  interface Props {
    activeFilter?: string | null;
    isDrawerOpen?: boolean;
    onHover?: (item: ArchiveItem | null) => void;
    onSelect?: (item: ArchiveItem) => void;
  }

  let { activeFilter = null, isDrawerOpen = false, onHover, onSelect }: Props = $props();

  let canvasEl: HTMLCanvasElement;
  let engine: VaultEngine | null = null;

  onMount(() => {
    engine = new VaultEngine(
      canvasEl,
      (item) => onHover?.(item),
      (item) => onSelect?.(item)
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
