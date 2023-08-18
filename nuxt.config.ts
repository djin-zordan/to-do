// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      supabaseKey: process.env.SUPABASE_KEY,
      supabaseURL: process.env.SUPABASE_URL
    }
  }
})
