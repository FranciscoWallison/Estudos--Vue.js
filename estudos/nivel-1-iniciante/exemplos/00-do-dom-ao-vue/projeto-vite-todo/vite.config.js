import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Documentação: https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), // ensina o Vite a entender e compilar arquivos .vue
  ],
  resolve: {
    alias: {
      // "@" vira atalho para a pasta src/.
      // Assim usamos import '@/components/X.vue' em vez de '../../components/X.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
