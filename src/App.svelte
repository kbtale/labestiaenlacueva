<script lang="ts">
  import VaultCanvas from './lib/VaultCanvas.svelte';
  import VaultNav from './lib/VaultNav.svelte';
  import VaultHud from './lib/VaultHud.svelte';
  import VaultPlayer from './lib/VaultPlayer.svelte';
  import type { ArchiveItem } from './lib/VaultEngine';

  let activeFilter = $state<string | null>(null);
  let hoveredItem = $state<ArchiveItem | null>(null);
  let selectedItem = $state<ArchiveItem | null>(null);

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
</script>

<div class="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-[#ededed]">
  <VaultCanvas
    {activeFilter}
    isDrawerOpen={selectedItem !== null}
    onHover={handleHover}
    onSelect={handleSelect}
  />

  <VaultNav
    {activeFilter}
    onFilterChange={handleFilterChange}
  />

  <VaultHud
    {hoveredItem}
  />

  <VaultPlayer
    {selectedItem}
    onClose={handleClosePlayer}
  />
</div>
