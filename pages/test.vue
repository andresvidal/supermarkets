<template>
    <div>
        <h1>Test Page</h1>
        <nav class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm relative group">
              Home
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </NuxtLink>
            <NuxtLink to="/maps" class="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium text-sm relative group">
              Mapper
              <span class="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </NuxtLink>
          </nav>
    </div>
</template>
