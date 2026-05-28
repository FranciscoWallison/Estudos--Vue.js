import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3333,
    // Proxy de desenvolvimento: o browser chama estes caminhos locais e o
    // Vite repassa para as APIs externas, contornando o CORS.
    proxy: {
      // Top músicas do Brasil (sem auth)
      '/api/itunes': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/itunes/, '')
      },
      // Letras — fonte principal (BR). Enviamos User-Agent de browser
      // porque a API responde 503 a clientes não-browser.
      '/api/vagalume': {
        target: 'https://api.vagalume.com.br',
        changeOrigin: true,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
        },
        rewrite: (path) => path.replace(/^\/api\/vagalume/, '')
      },
      // Letras — fallback (sem key)
      '/api/lyrics': {
        target: 'https://api.lyrics.ovh',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lyrics/, '')
      }
    }
  }
})
