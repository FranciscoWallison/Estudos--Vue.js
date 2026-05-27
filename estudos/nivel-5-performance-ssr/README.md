# Nível 5 — Performance, SSR e Build

Do app que funciona ao app que **performa** em produção.

## Objetivos

- Diagnosticar e otimizar performance de runtime e bundle.
- Dominar reatividade avançada (`shallowRef`, `markRaw`, `customRef`).
- Migrar uma SPA para Nuxt 3 (SSR/SSG).
- Configurar Vite avançado: env, plugins, library mode, PWA.

## Reatividade avançada

### `shallowRef` e `shallowReactive`
Só a referência é reativa, não os campos internos. Útil para estruturas grandes que mudam por inteiro (ex: dataset de gráfico).

```ts
const chart = shallowRef({ data: [], labels: [] })
chart.value = { ...chart.value, data: novosDados }  // reativo
chart.value.data.push(x)  // NÃO dispara update
```

### `markRaw`
Marca um objeto como **não reativo** permanentemente. Útil para instâncias de libs externas (ex: chart instance, mapa, websocket).

```ts
const map = markRaw(new MapboxGL(...))
const state = reactive({ map })  // map não é tornado reativo
```

### `customRef`
Cria um ref com `get`/`set` customizados. Use para debounce reativo, validação inline, etc.

```ts
function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: number
  return customRef<T>((track, trigger) => ({
    get() { track(); return value },
    set(newValue) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newValue
        trigger()
      }, delay)
    }
  }))
}
```

### `triggerRef`, `toRaw`
- `triggerRef(ref)`: força disparo manual (útil com `shallowRef`).
- `toRaw(obj)`: pega o objeto original por trás do Proxy. Use para serialização.

## Performance de runtime

### `v-memo`
Pula re-render se as dependências listadas não mudaram. Útil em listas grandes.

```vue
<li v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <!-- só re-renderiza se id ou selected mudar -->
</li>
```

### `v-once`
Renderiza uma única vez, depois nunca mais.

```vue
<header v-once>{{ siteTitle }}</header>
```

### Virtualização
Para listas com **milhares de itens**, renderize apenas o que está visível.

```bash
npm install vue-virtual-scroller
```

```vue
<RecycleScroller :items="items" :item-size="50" key-field="id">
  <template #default="{ item }">
    <ItemRow :item="item" />
  </template>
</RecycleScroller>
```

### Async components
Carregue componentes pesados sob demanda.

```ts
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: Loader,
  errorComponent: ErrorBox,
  delay: 200,
  timeout: 5000
})
```

## Análise de bundle

### Bundle visualizer
```bash
npm install -D rollup-plugin-visualizer
```

```js
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [vue(), visualizer({ open: true })]
})
```

### Code splitting manual
```js
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-vue': ['vue', 'vue-router', 'pinia'],
        'vendor-ui': ['element-plus'],
        'vendor-utils': ['axios', 'dayjs', 'lodash-es']
      }
    }
  }
}
```

### Tree shaking
- Use **named imports** (`import { sum } from 'lodash-es'`) não imports default em libs grandes.
- Prefira pacotes ESM (`lodash-es` vs `lodash`).
- Verifique `sideEffects: false` no `package.json` de libs próprias.

## Core Web Vitals

| Métrica | Bom | Como melhorar |
|--------|-----|--------------|
| LCP (Largest Contentful Paint) | < 2.5s | Hero image otimizada, SSR, preload de fontes |
| INP (Interaction to Next Paint) | < 200ms | Reduzir trabalho JS, dividir bundles, virtualizar listas |
| CLS (Cumulative Layout Shift) | < 0.1 | Reservar espaço para imagens/iframes, evitar inserções tardias |

Meça com **Lighthouse** no Chrome DevTools (modo mobile, throttling 3G).

## SSR com Nuxt 3

### Setup
```bash
npx nuxi@latest init my-app
cd my-app
npm install
npm run dev
```

### Estrutura
```
nuxt-app/
  pages/           # file-based routing
    index.vue          → /
    users/[id].vue     → /users/:id
  layouts/
    default.vue
  components/      # auto-imported
  composables/     # auto-imported
  server/api/      # endpoints Nitro (server routes)
  middleware/
  plugins/
  nuxt.config.ts
```

### Data fetching
```vue
<script setup>
// Roda no servidor + hidrata no cliente
const { data: posts, pending, error, refresh } = await useFetch('/api/posts')

// Só executa uma vez (SSG-friendly)
const { data: stats } = await useAsyncData('stats', () => $fetch('/api/stats'))
</script>
```

### SEO
```vue
<script setup>
useHead({
  title: 'Meu blog',
  meta: [
    { name: 'description', content: 'Posts sobre Vue' },
    { property: 'og:image', content: '/og.png' }
  ]
})
</script>
```

### Server routes (Nitro)
```ts
// server/api/posts.get.ts
export default defineEventHandler(async (event) => {
  return await db.posts.findMany()
})
```

### Modos
- `nuxt build` → SSR (renderiza por request).
- `nuxt generate` → SSG (HTML estático no build).
- `ssr: false` em nuxt.config → SPA-only (desabilita SSR).

### Hidratação
HTML do servidor + JS no cliente "ressuscita" os event listeners. Erro comum: conteúdo diferente entre server e client → **hydration mismatch**. Evite com `<ClientOnly>` em código que depende do browser:

```vue
<ClientOnly>
  <ChartFromBrowserLib />
</ClientOnly>
```

## PWA com vite-plugin-pwa

```bash
npm install -D vite-plugin-pwa
```

```js
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Meu App',
        short_name: 'App',
        theme_color: '#42b883',
        icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }]
      }
    })
  ]
})
```

## Library mode (publicar pacote npm)

```js
// vite.config.ts
build: {
  lib: {
    entry: 'src/index.ts',
    name: 'MyLib',
    fileName: 'my-lib'
  },
  rollupOptions: {
    external: ['vue'],
    output: { globals: { vue: 'Vue' } }
  }
}
```

```json
// package.json
{
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"]
}
```

## Próximos passos

[Desafios](desafios.md) → [Q&A](perguntas-respostas.md) → [nível 6](../nivel-6-arquitetura/).
