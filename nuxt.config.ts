// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  typescript: {
    typeCheck: false // Temporarily disabled
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  // Remove CSS import since Tailwind handles it
  nitro: {
    experimental: {
      websocket: true
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
    vippsApiKey: process.env.VIPPS_API_KEY,
    vippsClientId: process.env.VIPPS_CLIENT_ID,
    vippsClientSecret: process.env.VIPPS_CLIENT_SECRET,
    public: {
      apiBase: '/api'
    }
  }
})
