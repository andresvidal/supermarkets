<template>
  <div class="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs pointer-events-auto">
    <h3 class="text-sm font-medium text-gray-700 mb-2">Map Stats</h3>
    <div class="text-xs text-gray-600">
      <p>Data Sources: {{ selectedDataSourcesCount }}</p>
      <p>Visible Points: {{ totalPoints }}</p>
      <p>Bounds Drawn: {{ boundsCount }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  selectedDataSourcesCount: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  boundsCount: {
    type: Number,
    default: 0
  }
});
</script>
