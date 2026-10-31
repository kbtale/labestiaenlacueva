<script lang="ts">
  import VaultLoader from './lib/VaultLoader.svelte';
  import VaultCanvas from './lib/VaultCanvas.svelte';
  import VaultNav from './lib/VaultNav.svelte';
  import VaultHero from './lib/VaultHero.svelte';
  import VaultHud from './lib/VaultHud.svelte';
  import VaultPlayer from './lib/VaultPlayer.svelte';
  import type { ArchiveItem } from './lib/VaultEngine';

  let canvasComponent: { flyTo: (target: number) => void; rewindToStart: () => void } | null = $state(null);
  let activeFilter = $state<string | null>(null);
  let hoveredItem = $state<ArchiveItem | null>(null);
  let selectedItem = $state<ArchiveItem | null>(null);
  let currentDist = $state(0);
  let loadProgress = $state(0.05);

  function handleFilterChange(filter: string | null) {
    activeFilter = filter;
  }

  function handleHover(item: ArchiveItem | null) {
    hoveredItem = item;
  }

  function handleSelect(item: ArchiveItem) {
    selectedItem = item;
  }

  function handleClosePlayer() {
    selectedItem = null;
  }

  function handleDistChange(dist: number) {
    currentDist = dist;
  }

  function handleProgress(p: number) {
    loadProgress = Math.max(loadProgress, p);
  }

  function handleRewind() {
    canvasComponent?.rewindToStart();
  }
</script>

<div class="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-[#ededed]">
  <VaultLoader
    progress={loadProgress}
  />

  <VaultCanvas
    bind:this={canvasComponent}
    {activeFilter}
    isDrawerOpen={selectedItem !== null}
    onHover={handleHover}
    onSelect={handleSelect}
    onDistChange={handleDistChange}
    onProgress={handleProgress}
  />

  <VaultNav
    {activeFilter}
    dist={currentDist}
    onFilterChange={handleFilterChange}
    onRewind={handleRewind}
  />

  <VaultHero
    dist={currentDist}
  />

  <VaultHud
    {hoveredItem}
  />

  <VaultPlayer
    {selectedItem}
    onClose={handleClosePlayer}
  />
</div>
