<template>
  <div class="h-full w-full" ref="mapContainer">
    <!-- Map will be initialized here -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Make sure Leaflet default icon images are properly loaded
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
};

const props = defineProps({
  loadedSources: {
    type: Array,
    default: () => []
  },
  loadedData: {
    type: Object,
    default: () => ({})
  },
  onlyShowBounds: {
    type: Boolean,
    default: false
  },
  boundsLayerData: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['map-ready', 'bounds-changed']);

const mapContainer = ref(null);
const map = ref(null);
const markerLayers = ref({});
const boundsLayer = ref(null);

// Initialize map
onMounted(async () => {
  fixLeafletIcon();
  
  if (mapContainer.value) {
    await nextTick();
    
    map.value = L.map(mapContainer.value, {
      center: [28.36500174423078, -81.24687015767103],
      zoom: 12,
      preferCanvas: true
    });
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value);
    
    // Create layers for each data source
    props.loadedSources.forEach(source => {
      markerLayers.value[source.name] = L.layerGroup().addTo(map.value);
    });
    
    // Create bounds layer
    boundsLayer.value = L.layerGroup().addTo(map.value);
    
    // Add event listeners
    map.value.on('moveend', () => {
      emit('bounds-changed');
    });
    
    // Signal that the map is ready
    emit('map-ready');
  }
});

// Watch for changes in loaded sources and create layer groups
watch(() => props.loadedSources, (newSources) => {
  // Remove old layers
  Object.values(markerLayers.value).forEach(layer => {
    if (map.value && layer) {
      map.value.removeLayer(layer);
    }
  });
  
  markerLayers.value = {};
  
  // Create new layers
  newSources.forEach(source => {
    if (map.value) {
      markerLayers.value[source.name] = L.layerGroup().addTo(map.value);
    }
  });
  
  // Update markers
  renderMarkers();
}, { deep: true });

// Watch for changes in loaded data and update markers
watch(() => props.loadedData, () => {
  renderMarkers();
}, { deep: true });

// Watch for changes in bounds layer data and update bounds
watch(() => props.boundsLayerData, () => {
  renderBounds();
}, { deep: true });

// Watch for changes in only show bounds option
watch(() => props.onlyShowBounds, () => {
  renderMarkers();
});

// Render markers for all data sources
const renderMarkers = () => {
  if (!map.value) return;
  
  // Clear existing markers
  Object.values(markerLayers.value).forEach(layer => {
    if (layer) {
      layer.clearLayers();
    }
  });
  
  // Skip if only showing bounds
  if (props.onlyShowBounds) return;
  
  // Add markers for each data source
  props.loadedSources.forEach(source => {
    const layer = markerLayers.value[source.name];
    if (!layer) return;
    
    const sourceData = props.loadedData[source.name] || [];
    const markerColor = source.markerOptions?.color || 'blue';
    
    sourceData.forEach(item => {
      if (item.latitude && item.longitude) {
        const marker = L.marker([item.latitude, item.longitude], {
          icon: createColoredIcon(markerColor)
        });
        
        marker.bindPopup(createPopupContent(item));
        marker.addTo(layer);
      }
    });
  });
};

// Render bounds based on bounds layer data
const renderBounds = () => {
  if (!map.value || !boundsLayer.value) return;
  
  // Clear existing bounds
  boundsLayer.value.clearLayers();
  
  // Add new bounds
  props.boundsLayerData.forEach(boundData => {
    const rectangle = L.rectangle(boundData.bounds, {
      color: boundData.color,
      weight: boundData.weight,
      opacity: 0.7,
      fillOpacity: 0.2
    });
    
    rectangle.addTo(boundsLayer.value);
  });
};

// Create a colored icon for markers
const createColoredIcon = (color) => {
  return L.icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Create popup content for a marker
const createPopupContent = (item) => {
  return `
    <div class="text-sm">
      <p class="font-bold">${item.name}</p>
      <p>${item.address.streetAddress}, ${item.address.city}, ${item.address.state} ${item.address.zip}</p>
      <p><a href="${item.website}" target="_blank" class="text-blue-600 hover:underline">Website</a></p>
      <p>Phone: ${item.phone}</p>
    </div>
  `;
};

// Expose methods to parent component
defineExpose({
  getMapInstance: () => map.value,
  getMapBounds: () => map.value ? map.value.getBounds() : null
});
</script>
