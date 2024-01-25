import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  target: 'static',
  runtimeConfig: {
    public: {
      // Inject Fingerprint Pro API key
      API_KEY: process.env.API_KEY,
    },
  },
  devtools: { enabled: true }
})
