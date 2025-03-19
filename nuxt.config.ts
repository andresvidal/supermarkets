// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxtjs/leaflet',
    'nuxt-gtag'
  ],
  css: ['~/assets/css/main.css'],
  gtag: {
    id: 'G-C4RQTETSXS'
  },
  nitro: {
    preset: "cloudflare-pages"
  },
  ssr: false
})