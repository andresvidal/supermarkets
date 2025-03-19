<template>
    <div class="flex flex-col h-[calc(100dvh-8.25rem)]">
        <div
            class="bg-white shadow-sm px-4 py-3 flex items-center justify-between"
        >
            <h1 class="text-xl font-bold text-gray-800">Supermarkets Mapper</h1>
            <button
                @click="toggleSidebar"
                class="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
                <Icon
                    :name="sidebarOpen ? 'mdi:close' : 'mdi:menu'"
                    class="h-6 w-6"
                />
            </button>
        </div>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <div
                :class="[
                    'bg-white shadow-md z-10 flex flex-col overflow-y-auto transition-all duration-300',
                    sidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-80',
                ]"
            >
                <div class="p-4 space-y-6">
                    <!-- Data Sources -->
                    <div>
                        <h2 class="text-lg font-semibold text-gray-700 mb-3">
                            Available Data Sources
                        </h2>
                        <div class="flex justify-end space-x-2 mb-2">
                            <UButton
                                size="sm"
                                color="secondary"
                                @click="selectAllSources"
                                >Select all</UButton
                            >
                            <UButton
                                size="sm"
                                color="neutral"
                                variant="ghost"
                                @click="clearAllSources"
                                >Clear</UButton
                            >
                        </div>
                        <div
                            class="border border-slate-300 rounded-md mb-3 p-2 max-h-48 overflow-y-auto transition-all duration-300 hover:max-h-96"
                        >
                            <div
                                v-for="source in dataSources"
                                :key="source.name"
                                class="flex items-center py-1"
                            >
                                <input
                                    @change="loadDataSources"
                                    type="checkbox"
                                    :id="source.name"
                                    :value="source.name"
                                    v-model="selectedDataSources"
                                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label
                                    :for="source.name"
                                    class="ml-2 text-sm text-gray-700"
                                    >{{ source.name }}</label
                                >
                            </div>                            
                        </div>

                        <!-- <USelect class="w-48"
                            multiple
                            :items="dataSources.map((source) => source.name)"
                            v-model="selectedDataSources"
                            @change="mapUpdated" /> -->
                    </div>

                    <div class="border-t border-gray-200 pt-4">
                        <h3 class="font-medium text-gray-700 mb-3">
                            Boundary Options
                        </h3>
                        <div class="space-y-2">
                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    v-model="drawSameSourceDataBounds"
                                    @change="mapUpdated"
                                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700"
                                    >Draw Bounds Within Data Source</span
                                >
                            </label>

                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    v-model="onlyCrossSourceBounds"
                                    @change="mapUpdated"
                                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700"
                                    >Draw Bounds Across Data Source</span
                                >
                            </label>

                            <label class="flex items-center">
                                <input
                                    type="checkbox"
                                    v-model="onlyShowBounds"
                                    @change="loadDataSources"
                                    class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span class="ml-2 text-sm text-gray-700"
                                    >Hide pins</span
                                >
                            </label>

                            <URadioGroup
                                legend="Bounds Type"
                                orientation="horizontal"
                                color="neutral"
                                v-model="boundsType"
                                :items="boundsTypeOptions"
                                @change="mapUpdated"
                            />
                        </div>
                    </div>

                    <div class="border-t border-gray-200 pt-4">
                        <h3 class="font-medium text-gray-700 mb-3">
                            Analysis Settings
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label
                                    for="distance"
                                    class="block text-sm font-medium text-gray-700"
                                >
                                    Distance Threshold:
                                    {{ distanceThreshold.toFixed(1) }} miles
                                </label>
                                <input
                                    type="range"
                                    id="distance"
                                    v-model.number="distanceThreshold"
                                    @change="loadDataSources"
                                    min="0.1"
                                    max="25.0"
                                    step="0.1"
                                    class="mt-1 block w-full"
                                />
                            </div>

                            <div>
                                <label
                                    for="boundsWeight"
                                    class="block text-sm font-medium text-gray-700"
                                >
                                    Bounds Weight: {{ boundsWeight.toFixed(1) }}
                                </label>
                                <input
                                    type="range"
                                    id="boundsWeight"
                                    v-model.number="boundsWeight"
                                    min="0.5"
                                    max="5.0"
                                    step="0.5"
                                    class="mt-1 block w-full"
                                    @change="loadDataSources"
                                />
                            </div>

                            <div>
                                <h3
                                    class="block text-sm font-medium text-gray-700"
                                >
                                    Map stats
                                </h3>
                                <div class="text-xs text-gray-600">
                                    <p>
                                        Data Sources:
                                        {{ selectedDataSources.length }}
                                    </p>
                                    <p>
                                        Visible Points: {{ getTotalPoints() }}
                                    </p>
                                    <p>Bounds Drawn: {{ getBoundsCount() }}</p>
                                    <p>Bounds Type: {{ boundsType }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Map -->
            <div class="flex-1 relative">
                <l-map
                    ref="map"
                    :zoom="12"
                    :center="[28.36500174423078, -81.24687015767103]"
                    @update:center="mapUpdated"
                    class="h-full w-full"
                >
                    <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        name="Analyser.cc"
                        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> Analyser.cc"
                        ></l-tile-layer
                    >
                    <l-layer-group
                        v-if="!onlyShowBounds"
                        v-for="source in loadedSources"
                        :key="source.name"
                        :ref="(el) => (loadedLayers[source.name] = el)"
                    ></l-layer-group>
                    <l-layer-group ref="boundsLayer"></l-layer-group>
                </l-map>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import L from "leaflet";

// Map refs
const map = ref(null);
const boundsLayer = ref(null);
const loadedLayers = ref({});

// UI state
const sidebarOpen = ref(false);
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

// Data sources
const selectedDataSources = ref<any[]>([]);
const loadedSources = ref<any[]>([]);
const fetchedData = ref({});
const allDataCache = ref({}) // test a way to prevent chat net calls

// Options
const distanceThreshold = ref(1.5);
const boundsWeight = ref(1.0);
const drawSameSourceDataBounds = ref(false);
const onlyCrossSourceBounds = ref(false);
const onlyShowBounds = ref(false);
const boundsType = ref("Rectangle");
const boundsTypeOptions = ref(["Rectangle", "Circular"]);

const dataSources = ref([
    {
        name: "Aldi Stores",
        url: "/js/aldi.stores.json",
        markerOptions: { color: "blue" },
    },
    {
        name: "Publix Super Markets",
        url: "/js/publix.stores.json",
        markerOptions: {
            color: "green",
            // iconUrl:
            //     "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        },
    },
    {
        name: "Walmart Supercenter",
        url: "/js/walmart-supercenter.stores.json",
        markerOptions: { color: "gold" },
    },
    {
        name: "Walmart Neighborhood Market",
        url: "/js/walmart-neighborhood.stores.json",
        markerOptions: { color: "gold" },
    },
    {
        name: "Trader Joe's",
        url: "/js/traderjoes.stores.json",
        markerOptions: { color: "red" },
    },
    {
        name: "Whole Foods Market",
        url: "/js/wholefoods.stores.json",
        markerOptions: { color: "green" },
    },
    {
        name: "Dollar General Market",
        url: "/js/dollar-general-market.stores.json",
        markerOptions: { color: "yellow" },
    },
    {
        name: "Dollar General",
        url: "/js/dollar-general.stores.json",
        markerOptions: { color: "yellow" },
    },
    {
        name: "Family Dollar",
        url: "/js/family-dollar.stores.json",
        markerOptions: { color: "yellow" },
    },
    {
        name: "Winn-Dixie",
        url: "/js/winn-dixie.stores.json",
        markerOptions: { color: "blue" },
    },
]);

// Select all or clear data sources
const selectAllSources = () => {
    selectedDataSources.value = dataSources.value.map((source) => source.name);
    loadDataSources();
};

const clearAllSources = () => {
    selectedDataSources.value = [];
    loadDataSources();
};

// Initialize with some data sources selected
onMounted(() => {
    selectedDataSources.value = ["Aldi Stores", "Publix Super Markets"];
    // Load initial data after a short delay to ensure map is ready
    setTimeout(() => {
        loadDataSources();
    }, 500);
});

const mapUpdated = (event) => {
    loadDataSources();
};

const loadDataSources = async () => {
    if (!map.value?.leafletObject) return;
    const bounds = map.value.leafletObject.getBounds();

    loadedSources.value = dataSources.value.filter((source) =>
        selectedDataSources.value.includes(source.name)
    );
    for (const source of loadedSources.value) {
        try {
            const allData = await (await fetch(source.url)).json();
            fetchedData.value[source.name] = allData.filter((item) => {
                return (
                    item.latitude &&
                    item.longitude &&
                    bounds.contains([item.latitude, item.longitude])
                );
            });
            renderDataSource(source.name);
        } catch (error) {
            console.error(`Error fetching data for ${source.name}:`, error);
        }
    }
    drawBounds();
};

const renderDataSource = (sourceName) => {
    if (
        !loadedLayers.value[sourceName]?.leafletObject ||
        !map.value?.leafletObject
    )
        return;

    loadedLayers.value[sourceName].leafletObject.clearLayers();

    if (!onlyShowBounds.value) {
        fetchedData.value[sourceName].forEach((item) => {
            if (item.latitude && item.longitude) {
                const sourceMarkerOptions = loadedSources.value.find(
                    (source) => source.name === sourceName
                )?.markerOptions;
                const iconUrlFromSource = sourceMarkerOptions?.iconUrl
                    ? sourceMarkerOptions.iconUrl
                    : `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${sourceMarkerOptions?.color}.png`;

                L.marker([item.latitude, item.longitude], {
                    icon: L.icon({
                        iconUrl: iconUrlFromSource,
                        shadowUrl:
                            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41],
                    }),
                })
                    .bindPopup(
                        `<div class="text-sm">
              <p class="font-bold">${item.name}</p>
              <p>${item.address.streetAddress}, ${item.address.city}, ${item.address.state} ${item.address.zip}</p>
              <p><a href="${item.website}" target="_blank" class="text-blue-600 hover:underline">Website</a></p>
              <p>Phone: ${item.phone}</p>
            </div>`
                    )
                    .addTo(loadedLayers.value[sourceName].leafletObject);
            }
        });
    }
};

const drawBounds = () => {
    if (!boundsLayer.value?.leafletObject || !map.value?.leafletObject) return;

    boundsLayer.value.leafletObject.clearLayers();

    if (!drawSameSourceDataBounds.value && !onlyCrossSourceBounds.value) {
        return; // Clear layers already handled, just exit
    }

    const allPoints = [];
    loadedSources.value.forEach((source) => {
        fetchedData.value[source.name]?.forEach((point) => {
            if (point.latitude && point.longitude) {
                allPoints.push({
                    source: source.name,
                    lat: point.latitude,
                    lng: point.longitude,
                });
            }
        });
    });

    for (let i = 0; i < allPoints.length; i++) {
        for (let j = i + 1; j < allPoints.length; j++) {
            const point1 = allPoints[i];
            const point2 = allPoints[j];
            const distance = map.value.leafletObject.distance(
                [point1.lat, point1.lng],
                [point2.lat, point2.lng]
            );
            const distanceMiles = distance * 0.000621371;

            if (distanceMiles <= distanceThreshold.value) {
                let boundsColor = "";

                if (
                    drawSameSourceDataBounds.value &&
                    point1.source === point2.source
                ) {
                    boundsColor = "blue";
                }

                if (
                    onlyCrossSourceBounds.value &&
                    point1.source !== point2.source
                ) {
                    boundsColor = "red";
                }

                if (boundsColor) {
                    const bounds = L.latLngBounds(
                        [point1.lat, point1.lng],
                        [point2.lat, point2.lng]
                    );
                    if (boundsType.value === "Rectangle") {
                        L.rectangle(bounds, {
                            color: boundsColor,
                            weight: boundsWeight.value,
                            opacity: 0.7,
                            fillOpacity: 0.2,
                        }).addTo(boundsLayer.value.leafletObject);
                    } else {
                        const center1 = [point1.lat, point1.lng];
                        L.circle(center1, {
                            radius: distance,
                            color: boundsColor,
                            weight: boundsWeight.value,
                            opacity: 0.7,
                            fillOpacity: 0.2,
                        }).addTo(boundsLayer.value.leafletObject);

                        const center2 = [point2.lat, point2.lng];
                        L.circle(center2, {
                            radius: distance,
                            color: boundsColor,
                            weight: boundsWeight.value,
                            opacity: 0.7,
                            fillOpacity: 0.2,
                        }).addTo(boundsLayer.value.leafletObject);
                    }
                }
            }
        }
    }
};

// Helper methods for map stats
const getTotalPoints = () => {
    let total = 0;
    loadedSources.value.forEach((source) => {
        total += fetchedData.value[source.name]?.length || 0;
    });
    return total;
};

const getBoundsCount = () => {
    return boundsLayer.value?.leafletObject?.getLayers().length || 0;
};
</script>

<style scoped>
.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
