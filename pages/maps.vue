<template>
    <div class="flex flex-col h-screen">
      <AppHeader :title="'Data Source Mapper'" @toggle-sidebar="toggleSidebar" :sidebar-open="sidebarOpen" />
  
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <SidebarPanel 
          :sidebar-open="sidebarOpen"
          :data-sources="dataSources"
          :selected-data-sources="selectedDataSources"
          :draw-same-source-data-bounds="drawSameSourceDataBounds"
          :only-cross-source-bounds="onlyCrossSourceBounds"
          :only-show-bounds="onlyShowBounds"
          :distance-threshold="distanceThreshold"
          :bounds-weight="boundsWeight"
          @update:selected-data-sources="selectedDataSources = $event"
          @update:draw-same-source-data-bounds="drawSameSourceDataBounds = $event"
          @update:only-cross-source-bounds="onlyCrossSourceBounds = $event"
          @update:only-show-bounds="onlyShowBounds = $event"
          @update:distance-threshold="distanceThreshold = $event"
          @update:bounds-weight="boundsWeight = $event"
          @load-data="loadDataSources"
        />
        
        <!-- Map Container -->
        <div class="flex-1 relative">
          <MapComponent 
            ref="mapComponent"
            :loaded-sources="loadedSources"
            :loaded-data="fetchedData"
            :only-show-bounds="onlyShowBounds"
            :bounds-layer-data="boundsLayerData"
            @map-ready="onMapReady"
            @bounds-changed="onBoundsChanged"
          />
          
          <!-- Map Stats Overlay -->
          <MapStatsOverlay
            :selected-data-sources-count="selectedDataSources.length"
            :total-points="getTotalPoints()"
            :bounds-count="getBoundsCount()"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
//   import { ref, computed, onMounted, watch } from 'vue';
//   import AppHeader from './components/AppHeader.vue';
//   import SidebarPanel from './components/SidebarPanel.vue';
//   import MapComponent from './components/MapComponent.vue';
//   import MapStatsOverlay from './components/MapStatsOverlay.vue';
//   import { calculateBounds } from './utils/mapUtils';
  
  // Map refs
  const mapComponent = ref(null);
  
  // UI state
  const sidebarOpen = ref(false);
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
  
  // Data sources
  const selectedDataSources = ref([]);
  const loadedSources = ref([]);
  const fetchedData = ref({});
  const boundsLayerData = ref([]);
  
  // Options
  const distanceThreshold = ref(1.5);
  const boundsWeight = ref(1.0);
  const drawSameSourceDataBounds = ref(false);
  const onlyCrossSourceBounds = ref(false);
  const onlyShowBounds = ref(false);
  
  // Available data sources
  const dataSources = ref([
    {
      name: 'Aldi Stores',
      url: '/js/aldi.stores.json',
      markerOptions: { color: 'blue' },
    },
    {
      name: 'Publix Super Markets',
      url: '/js/publix.stores.json',
      markerOptions: { color: 'green' },
    },
    {
      name: 'Walmart Supercenter',
      url: '/js/walmart-supercenter.stores.json',
      markerOptions: { color: 'gold' },
    },
    {
      name: 'Walmart Neighborhood Market',
      url: '/js/walmart-neighborhood.stores.json',
      markerOptions: { color: 'orange' },
    },
    {
      name: "Trader Joe's",
      url: '/js/traderjoes.stores.json',
      markerOptions: { color: 'red' },
    },
    {
      name: 'Whole Foods Market',
      url: '/js/wholefoods.stores.json',
      markerOptions: { color: 'darkgreen' },
    },
  ]);
  
  // Initialize with some data sources selected
  onMounted(() => {
    selectedDataSources.value = ['Aldi Stores', 'Publix Super Markets'];
  });
  
  // Watch for changes in options to recalculate bounds
  watch([drawSameSourceDataBounds, onlyCrossSourceBounds, distanceThreshold, boundsWeight], () => {
    calculateBoundsData();
  });
  
  // Map event handlers
  const onMapReady = () => {
    // Load initial data when map is ready
    loadDataSources();
  };
  
  const onBoundsChanged = () => {
    loadDataSources();
  };
  
  // Load data sources based on current map bounds
  const loadDataSources = async () => {
    if (!mapComponent.value) return;
    
    const bounds = mapComponent.value.getMapBounds();
    if (!bounds) return;
    
    loadedSources.value = dataSources.value.filter((source) => 
      selectedDataSources.value.includes(source.name)
    );
    
    for (const source of loadedSources.value) {
      try {
        const response = await fetch(source.url);
        const allData = await response.json();
        
        fetchedData.value[source.name] = allData.filter((item) => {
          return item.latitude && item.longitude && 
                 bounds.contains([item.latitude, item.longitude]);
        });
      } catch (error) {
        console.error(`Error fetching data for ${source.name}:`, error);
      }
    }
    
    calculateBoundsData();
  };
  
  // Calculate bounds between points
  const calculateBoundsData = () => {
    if (!mapComponent.value) return;
    
    const mapInstance = mapComponent.value.getMapInstance();
    if (!mapInstance) return;
    
    boundsLayerData.value = calculateBounds({
      fetchedData: fetchedData.value,
      loadedSources: loadedSources.value,
      distanceThreshold: distanceThreshold.value,
      drawSameSourceDataBounds: drawSameSourceDataBounds.value,
      onlyCrossSourceBounds: onlyCrossSourceBounds.value,
      boundsWeight: boundsWeight.value,
      calculateDistance: (point1, point2) => 
        mapInstance.distance([point1.lat, point1.lng], [point2.lat, point2.lng]) * 0.000621371 // Convert to miles
    });
  };
  
  // Helper methods for map stats
  const getTotalPoints = () => {
    let total = 0;
    loadedSources.value.forEach(source => {
      total += fetchedData.value[source.name]?.length || 0;
    });
    return total;
  };
  
  const getBoundsCount = () => {
    return boundsLayerData.value.length;
  };
  </script>