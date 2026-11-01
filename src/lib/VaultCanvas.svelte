<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { VaultEngine, type ArchiveItem } from './VaultEngine';

  interface Props {
    activeFilter?: string | null;
    isDrawerOpen?: boolean;
    isSectionModalOpen?: boolean;
    onHover?: (item: ArchiveItem | null, pos?: { x: number; y: number }) => void;
    onSelect?: (item: ArchiveItem) => void;
    onDistChange?: (dist: number, activeItem?: ArchiveItem | null) => void;
    onProgress?: (progress: number) => void;
  }

  let {
    activeFilter = null,
    isDrawerOpen = false,
    isSectionModalOpen = false,
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

  export function rewindToStart() {
    engine?.rewindToStart();
  }

  export function startIntro() {
    engine?.startIntro();
  }

  onMount(() => {
    engine = new VaultEngine(
      canvasEl,
      (item, pos) => onHover?.(item, pos),
      (item) => onSelect?.(item),
      (dist, activeItem) => onDistChange?.(dist, activeItem),
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

  $effect(() => {
    if (engine) {
      engine.setSectionModalOpen(isSectionModalOpen);
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
<div
  class="fixed inset-0 pointer-events-none z-[1] select-none"
  style="background: radial-gradient(ellipse at 50% 50%, rgba(10, 10, 11, 0) 48%, rgba(6, 7, 9, 0.38) 78%, rgba(3, 4, 6, 0.75) 100%);"
></div>
