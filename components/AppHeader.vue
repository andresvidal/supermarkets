<template>
  <div class="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
    <h1 class="text-xl font-bold text-gray-800">{{ title }}</h1>
    <button @click="$emit('toggle-sidebar')" class="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100">
      <svg v-if="sidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  sidebarOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-sidebar']);
</script>
