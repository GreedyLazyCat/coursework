// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/icon', 'nuxt-auth-utils', '@pinia/nuxt'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    filesFolderPath: ''
  }
})