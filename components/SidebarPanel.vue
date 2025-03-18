<template>
  <div :class="[
    'bg-white shadow-md z-10 flex flex-col overflow-y-auto transition-all duration-300',
    sidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-80'
  ]">
    <div class="p-4 space-y-6">
      <!-- Data Sources -->
      <div>
        <h2 class="text-lg font-semibold text-gray-700 mb-3">Available Data Sources</h2>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div v-for="source in dataSources" :key="source.name" class="flex items-center">
            <input 
              type="checkbox" 
              :id="source.name" 
              :value="source.name"
              :checked="selectedDataSources.includes(source.name)"
              @change="toggleDataSource(source.name)" 
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label :for="source.name" class="ml-2 text-sm text-gray-700">{{ source.name }}</label>
          </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <h3 class="font-medium text-gray-700 mb-3">Boundary Options</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input 
              type="checkbox" 
              :checked="drawSameSourceDataBounds"
              @change="$emit('update:draw-same-source-data-bounds', $event.target.checked)"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
            /> 
            <span class="ml-2 text-sm text-gray-700">Draw Bounds Same Data Source</span>
          </label>
          
          <label class="flex items-center">
            <input 
              type="checkbox" 
              :checked="onlyCrossSourceBounds"
              @change="$emit('update:only-cross-source-bounds', $event.target.checked)"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
            /> 
            <span class="ml-2 text-sm text-gray-700">Draw Bounds Cross Data Source</span>
          </label>
          
          <label class="flex items-center">
            <input 
              type="checkbox" 
              :checked="onlyShowBounds"
              @change="$emit('update:only-show-bounds', $event.target.checked)"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
            /> 
            <span class="ml-2 text-sm text-gray-700">Only Show Bounds</span>
          </label>
        </div>
      </div>
      
      <div class="border-t border-gray-200 pt-4">
        <h3 class="font-medium text-gray-700 mb-3">Analysis Settings</h3>
        <div class="space-y-4">
          <div>
            <label for="distance" class="block text-sm font-medium text-gray-700">
              Distance Threshold: {{ distanceThreshold.toFixed(1) }} miles
            </label>
            <input 
              type="range" 
              id="distance" 
              :value="distanceThreshold" 
              @input="$emit('update:distance-threshold', parseFloat($event.target.value))"
              min="0.1" 
              max="5.0"
              step="0.1"
              class="mt-1 block w-full" 
            />
          </div>
          
          <div>
            <label for="boundsWeight" class="block text-sm font-medium text-gray-700">
              Bounds Weight: {{ boundsWeight.toFixed(1) }}
            </label>
            <input 
              type="range" 
              id="boundsWeight" 
              :value="boundsWeight" 
              @input="$emit('update:bounds-weight', parseFloat($event.target.value))"
              min="0.5" 
              max="5.0"
              step="0.5"
              class="mt-1 block w-full" 
            />
          </div>
        </div>
      </div>
      
      <button 
        @click="$emit('load-data')"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition"
      >
        <span class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Load Selected Data
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: false
  },
  dataSources: {
    type: Array,
    required: true
  },
  selectedDataSources: {
    type: Array,
    required: true
  },
  drawSameSourceDataBounds: {
    type: Boolean,
    default: false
  },
  onlyCrossSourceBounds: {
    type: Boolean,
    default: false
  },
  onlyShowBounds: {
    type: Boolean,
    default: false
  },
  distanceThreshold: {
    type: Number,
    default: 1.5
  },
  boundsWeight: {
    type: Number,
    default: 1.0
  }
});

const emit = defineEmits([
  'update:selected-data-sources',
  'update:draw-same-source-data-bounds',
  'update:only-cross-source-bounds',
  'update:only-show-bounds',
  'update:distance-threshold',
  'update:bounds-weight',
  'load-data'
]);

const toggleDataSource = (sourceName) => {
  const currentSelected = [...props.selectedDataSources];
  const index = currentSelected.indexOf(sourceName);
  
  if (index === -1) {
    currentSelected.push(sourceName);
  } else {
    currentSelected.splice(index, 1);
  }
  
  emit('update:selected-data-sources', currentSelected);
  // Trigger map refresh when data sources change
  setTimeout(() => {
    emit('load-data');
  }, 0);
};
</script>
