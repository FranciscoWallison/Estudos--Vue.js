// ════════════════════════════════════════════════════════════════
//  PONTO DE ENTRADA da aplicação inteira.
//  É o mesmo createApp(...).mount('#app') dos exemplos via CDN,
//  só que agora App e os estilos vêm de arquivos.
// ════════════════════════════════════════════════════════════════
import { createApp } from 'vue'
import App from './App.vue'        // o componente RAIZ (um arquivo .vue)
import router from './router'      // o plugin de rotas
import './assets/main.css'         // css global (passa pelo build do Vite)

createApp(App)      // (A) cria a app a partir do componente raiz
  .use(router)      // (B) instala o plugin de rotas (habilita <RouterView>, etc.)
  .mount('#app')    // (C) "cola" no <div id="app"> do index.html
