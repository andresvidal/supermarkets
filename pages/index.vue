<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Hero Section -->
    <div class="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-8 md:p-16 mb-16 shadow-lg">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Supermarkets Data Mapper</h1>
        <p class="text-xl md:text-2xl mb-8 opacity-90">Visualize and analyze geographic data from multiple sources</p>
        <NuxtLink 
          to="/maps" 
          class="inline-flex items-center px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition transform hover:-translate-y-1 hover:shadow-lg"
        >
          Launch Mapper
          <Icon name="mdi:arrow-right" class="ml-2" />
        </NuxtLink>
      </div>
    </div>

    <!-- Features Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(feature, index) in features" :key="index" 
             class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <Icon :name="feature.icon" class="w-8 h-8 text-blue-600" />
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-3">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Use Cases</h2>
      
      <div class="space-y-6">
        <div v-for="(useCase, index) in useCases" :key="index"
             class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ useCase.title }}</h3>
          <p class="text-gray-600">{{ useCase.description }}</p>
        </div>
      </div>
    </section>
    
    <!-- Data Sources Section -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Available Data Sources</h2>
      
      <div class="flex flex-wrap justify-center gap-4">
        <div v-for="source in dataSources" :key="source.name" 
             class="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
          <div class="w-4 h-4 rounded-full mr-2" :style="{ backgroundColor: source.color }"></div>
          <span class="text-gray-700">{{ source.name }}</span>
        </div>
      </div>
    </section>
    
    <!-- Call to Action -->
    <section class="text-center py-12">
      <h2 class="text-3xl font-bold text-gray-800 mb-8">Ready to explore?</h2>
      <NuxtLink 
        to="/maps" 
        class="inline-flex items-center px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition transform hover:-translate-y-1 hover:shadow-lg"
      >
        Open Mapper
        <Icon name="mdi:arrow-right" class="ml-2" />
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
const dataSources = [
  { name: 'Aldi Stores', color: '#0066cc' },
  { name: 'Publix Super Markets', color: '#008800' },
  { name: 'Walmart Supercenter', color: '#ffc220' },
  { name: 'Walmart Neighborhood Market', color: '#ffc220' },
  { name: "Trader Joe's", color: '#cc0000' },
  { name: 'Whole Foods Market', color: '#3bb143' }
];

const features = [
  {
    icon: 'mdi:map-marker',
    title: 'Multi-source Mapping',
    description: 'Visualize data from various sources on a single interactive map'
  },
  {
    icon: 'mdi:compare',
    title: 'Competitive Analysis',
    description: 'Identify areas where different data sources overlap or compete'
  },
  {
    icon: 'mdi:ruler-square',
    title: 'Distance Thresholds',
    description: 'Customize proximity analysis with adjustable distance parameters'
  },
  {
    icon: 'mdi:filter-variant',
    title: 'Flexible Filtering',
    description: 'Select specific data sources to display and analyze'
  },
  {
    icon: 'mdi:chart-box-outline',
    title: 'Visual Boundaries',
    description: 'Highlight relationships between data points with customizable boundaries'
  },
  {
    icon: 'mdi:refresh',
    title: 'Real-time Updates',
    description: 'Data visualization refreshes as you navigate the map'
  }
];

const useCases = [
  {
    title: 'Retail Analysis',
    description: 'Perfect for comparing grocery store locations in the same area. Identify competitive hotspots and potential expansion opportunities.'
  },
  {
    title: 'Market Research',
    description: 'Analyze geographic distribution of businesses to inform strategic decision-making.'
  },
  {
    title: 'Urban Planning',
    description: 'Visualize service distribution across neighborhoods to identify gaps and overlaps.'
  }
];
</script>