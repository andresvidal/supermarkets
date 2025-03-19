<template>
  <div class="flex flex-col min-h-screen">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center text-blue-600 font-bold text-xl">
              <Icon name="mdi:map" class="h-6 w-6 mr-2" />
              <span>Analyser</span> <span class="text-xs px-2 text-blue-800">v0.1.0</span>
            </NuxtLink>
          </div>
          <nav class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm relative group">
              Home
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </NuxtLink>
            <NuxtLink to="/maps" class="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm relative group">
              Supermarkets
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer class="bg-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} Analyser.cc All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>