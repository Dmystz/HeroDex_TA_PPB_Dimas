import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  // process.env tidak membaca file .env, jadi harus lewat loadEnv.
  const env = loadEnv(mode, process.cwd(), '')
  const api = (env.VITE_API_URL || '').replace(/\/+$/, '')

  return {
    base: './',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'HeroDex: Game Character Encyclopedia',
          short_name: 'HeroDex',
          description: 'Ensiklopedia karakter game.',
          lang: 'id',
          theme_color: '#070b1a',
          background_color: '#070b1a',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: './',
          start_url: './',
          icons: [
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: api
            ? [
                {
                  urlPattern: ({ url }) => url.href.startsWith(api),
                  handler: 'NetworkFirst',
                  options: {
                    cacheName: 'api-cache',
                    networkTimeoutSeconds: 5,
                    cacheableResponse: { statuses: [200] },
                    expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 }
                  }
                }
              ]
            : []
        }
      })
    ]
  }
})
