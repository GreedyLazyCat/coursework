// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@prisma/nuxt', 'nuxt-auth-utils'],
  devtools: { enabled: true }
})