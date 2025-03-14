<template>
    <div>
      <div class="container">
        <h1>Data Source Mapper</h1>
  
        <div class="flex-row">
  
          <div class="details">
            <h2>Available Data Sources</h2>
  
            <div v-for="source in dataSources" :key="source.name">
              <input @change="loadDataSources" type="checkbox" :id="source.name" :value="source.name"
                v-model="selectedDataSources" />
              <label :for="source.name">{{ source.name }}</label>
            </div>
            <hr />
            <div>
              <label>
                <input type="checkbox" v-model="drawSameSourceDataBounds" @change="loadDataSources" /> Draw Bounds Same
                Data Source
              </label>
            </div>
  
            <div>
              <label>
                <input type="checkbox" v-model="onlyCrossSourceBounds" @change="loadDataSources" /> Draw Bounds Cross Data
                Source (Competition)
              </label>
            </div>
  
            <div>
              <label>
                <input type="checkbox" v-model="onlyShowBounds" @change="loadDataSources" /> Only Show Bounds
              </label>
            </div>
  
            <hr />
  
            <button @click="loadDataSources">Load Selected Data</button>
  
            <hr />
  
            <div>
              <label for="distance">Distance Threshold (miles): </label>
              <input type="number" id="distance" v-model.number="distanceThreshold" min="0" step="0.1"
                @change="loadDataSources" />
            </div>
            <div>
              <label for="boundsWeight">Bounds weight: </label>
              <input type="number" id="boundsWeight" v-model.number="boundsWeight" min="1" step="0.5"
                @change="loadDataSources" />
            </div>
          </div>
  
          <div class="map">
            <l-map ref="map" :zoom="12" :center="[28.36500174423078, -81.24687015767103]"
              @update:center="mapUpdated"
            >
              <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
              <l-layer-group v-if="!onlyShowBounds" v-for="source in loadedSources" :key="source.name"
                :ref="(el) => loadedLayers[source.name] = el"></l-layer-group>
              <l-layer-group ref="boundsLayer"></l-layer-group>
            </l-map>
          </div>
  
        </div>
  
      </div>
    </div>
  </template>
  
  <style>
  html, body {margin: 0; padding: 0;}
  
  .container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100vh;
  }
  
  .flex-row {display: flex; flex-direction: row; gap: 12px; flex-grow: 1;}
  
  .map {flex-grow: 1;}
  
  .details {background-color: #f0f0f0; padding: 0 12px;}
  </style>
  
  <script setup lang="ts">
//   import { ref, watch } from 'vue';
//   import { LMap, LTileLayer, LMarker, LLayerGroup, LRectangle } from '@vue-leaflet/vue-leaflet';
//   import 'leaflet/dist/leaflet.css';
  import L from 'leaflet';
  
  const map = ref<InstanceType<typeof LMap> | null>(null);
  const selectedDataSources = ref<string[]>([]);
  const dataSources = ref<{ name: string; url: string; markerOptions: { color?: string; iconUrl?: string } }>([]);
  
  dataSources.value = [
    {
      name: 'Aldi Stores',
      url: '/js/aldi.stores.json',
      markerOptions: { color: 'blue' },
    },
    {
      name: 'Publix Super Markets',
      url: '/js/publix.stores.json',
      markerOptions: { color: 'green', iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png' },
    },
    {
      name: 'Walmart Supercenter',
      url: '/js/walmart-supercenter.stores.json',
      markerOptions: { color: 'yellow' },
    },
    {
      name: 'Walmart Neighborhood Market',
      url: '/js/walmart-neighborhood.stores.json',
      markerOptions: { color: 'yellow' },
    },
    {
      name: "Trader Joe's",
      url: '/js/traderjoes.stores.json',
      markerOptions: { color: 'yellow' },
    },
    {
      name: 'Whole Foods Market',
      url: '/js/wholefoods.stores.json',
      markerOptions: { color: 'yellow' },
    },
  ];
  
  const loadedSources = ref<{ name: string; url: string; markerOptions: { color?: string; iconUrl?: string } }[]>([]);
  const loadedLayers = ref<{ [key: string]: InstanceType<typeof LLayerGroup> | null }>({});
  const fetchedData = ref<{ [key: string]: any[] }>({});
  const boundsLayer = ref<InstanceType<typeof LLayerGroup> | null>(null);
  const distanceThreshold = ref<number>(1.5);
  const boundsWeight = ref<number>(1.0);
  const drawSameSourceDataBounds = ref<boolean>(false);
  const onlyCrossSourceBounds = ref<boolean>(false);
  const onlyShowBounds = ref<boolean>(false);
  
  const mapUpdated = (event: any) => {
    // console.log('Map centered', event);
    loadDataSources();
  };
  
  const loadDataSources = async () => {
    if (!map.value?.leafletObject) return;
    const bounds = map.value.leafletObject.getBounds();
  
    loadedSources.value = dataSources.value.filter((source) => selectedDataSources.value.includes(source.name));
    for (const source of loadedSources.value) {
      try {
        const allData = await (await fetch(source.url)).json();
        fetchedData.value[source.name] = allData.filter((item) => {
          return item.latitude && item.longitude && bounds.contains([item.latitude, item.longitude]);
        });
        renderDataSource(source.name);
      } catch (error) {
        console.error(`Error fetching data for ${source.name}:`, error);
      }
    }
    drawBounds();
    // fitBounds(); // buggy
  };
  
  const renderDataSource = (sourceName: string) => {
    if (!loadedLayers.value[sourceName]?.leafletObject || !map.value?.leafletObject) return;
  
    loadedLayers.value[sourceName].leafletObject.clearLayers();
  
    if (!onlyShowBounds.value) {
      fetchedData.value[sourceName].forEach((item) => {
        if (item.latitude && item.longitude) {
          const sourceMarkerOptions = loadedSources.value.find((source) => source.name === sourceName)?.markerOptions;
          const iconUrlFromSource = sourceMarkerOptions?.iconUrl
            ? sourceMarkerOptions.iconUrl
            : `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${sourceMarkerOptions?.color}.png`;
  
          L.marker([item.latitude, item.longitude], {
            icon: L.icon({
              iconUrl: iconUrlFromSource,
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .bindPopup(
              `<b>${item.name}</b><br>${item.address.streetAddress}, ${item.address.city}, ${item.address.state} ${item.address.zip}<br><a href="${item.website}" target="_blank">Website</a><br>Phone: ${item.phone}`
            )
            .addTo(loadedLayers.value[sourceName].leafletObject);
        }
      });
    }
  };
  
  const fitBounds = () => {
    if (!map.value?.leafletObject) return;
    const allLayers = Object.values(loadedLayers.value)
      .filter((layer) => layer?.leafletObject)
      .flatMap((layer) => layer!.leafletObject.getLayers());
    allLayers.push(...boundsLayer.value.leafletObject.getLayers());
  
    if (allLayers.length > 0) {
      const group = L.featureGroup(allLayers);
      if (group.getBounds().isValid()) {
        map.value.leafletObject.fitBounds(group.getBounds());
      }
    }
  };
  
  const drawBounds = () => {
    if (!boundsLayer.value?.leafletObject || !map.value?.leafletObject) return;
  
    boundsLayer.value.leafletObject.clearLayers();
  
    if (!drawSameSourceDataBounds.value && !onlyCrossSourceBounds.value) {
      return; // Clear layers already handled, just exit
    }
  
    const allPoints: { source: string; lat: number; lng: number }[] = [];
    loadedSources.value.forEach((source) => {
      fetchedData.value[source.name].forEach((point) => {
        if (point.latitude && point.longitude) {
          allPoints.push({ source: source.name, lat: point.latitude, lng: point.longitude });
        }
      });
    });
  
    for (let i = 0; i < allPoints.length; i++) {
      for (let j = i + 1; j < allPoints.length; j++) {
        const point1 = allPoints[i];
        const point2 = allPoints[j];
        const distance = map.value.leafletObject.distance([point1.lat, point1.lng], [point2.lat, point2.lng]);
        const distanceMiles = distance * 0.000621371;
  
        if (distanceMiles <= distanceThreshold.value) {
          let boundsColor = ''; // Initialize to empty string
  
          if (drawSameSourceDataBounds.value && point1.source === point2.source) {
            boundsColor = 'blue';
          }
  
          if (onlyCrossSourceBounds.value && point1.source !== point2.source) {
            boundsColor = 'red';
          }
  
          if (boundsColor) { // Only draw if a color is assigned
            const bounds = L.latLngBounds([point1.lat, point1.lng], [point2.lat, point2.lng]);
            L.rectangle(bounds, { color: boundsColor, weight: boundsWeight.value }).addTo(boundsLayer.value.leafletObject);
          }
        }
      }
    }
  };
  </script>