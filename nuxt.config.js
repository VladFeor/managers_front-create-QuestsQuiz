// https://nuxt.com/docs/api/configuration/nuxt-config

require('dotenv').config();
import { splitVendorChunkPlugin } from 'vite';

export default defineNuxtConfig({
  loading: false,
  modules: ['@pinia/nuxt', '@nuxt/ui', '@element-plus/nuxt'],
  ssr: false,
  loadingIndicator: {
    loading: false,
  },
  // loadingIndicator: '~/layouts/_loading.vue',
  router: {
    middleware: ['layout'],
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  plugins: [{ src: './alert.plugin' }],
  layouts: {
    // Specify the default layout for all pages
    default: '~/layouts/default.vue',
    loading: '~/layouts/_loading.vue',
    spaLoadingTemplate: '~/layouts/_loading.vue',
  },
  runtimeConfig: {
    public: {
      gtagId: 'GTM-5PKW9LWC',
      pusherKey: '18f7028f674aef56fa35',
      pusherCluster: 'eu',
      base: 'http://54.227.53.151/manager/back/',
      apiBase: 'http://54.227.53.151/manager/back/api/',
      apiBaseV2: 'http://54.227.53.151/manager/back/api/v2/',
      /*       apiBase: 'https://project.talentum.id/api/',
      apiBaseV2: 'https://project.talentum.id/api/v2/', */
      telegramBot: '@talentumid_bot',
      gtagId: 'G-2QFKLWP4K1',
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  components: {
    path: '~/components',
    extensions: ['.vue'],
    pathPrefix: false,
    global: true,
  },
  vite: {
    css: {
      minify: true,
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/main.scss";',
        },
      },
    },
    plugins: [splitVendorChunkPlugin()],
    build: {
      cacheDir: '.vitecache',
    },
  },
  publicRuntimeConfig: {
    apiURL: process.env.NUXT_API || '',
  },
  buildModules: [
    // Simple usage
    '@nuxtjs/dotenv',
    'vue-clipboard2/nuxt',
  ],
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
