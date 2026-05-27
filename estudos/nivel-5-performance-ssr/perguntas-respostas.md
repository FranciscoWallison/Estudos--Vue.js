# Nível 5 — Perguntas e Respostas

---

### 1. Quando usar `shallowRef` em vez de `ref`?

<details>
<summary>Resposta</summary>

Quando o valor é um **objeto grande e mutável** que você **substitui inteiro** em vez de modificar campo a campo.

```ts
// Bom para shallowRef: chart data, AST, configurações imutáveis
const dataset = shallowRef({ rows: hugeArray, meta: {...} })
dataset.value = { ...dataset.value, rows: newArray }  // dispara update
dataset.value.rows.push(x)  // NÃO dispara
```

Ganho: Vue não cria Proxies profundos — menos memória, mais velocidade.
</details>

---

### 2. O que `markRaw` resolve?

<details>
<summary>Resposta</summary>

Marca um objeto para **nunca** ser tornado reativo. Útil para instâncias de libs externas que têm próprio sistema de eventos/estado.

```ts
import { markRaw, reactive } from 'vue'
import L from 'leaflet'

const state = reactive({
  map: markRaw(L.map('map'))  // se reativo, Leaflet quebra
})
```

Casos típicos: Chart.js, Mapbox, Leaflet, classes 3rd-party, WebSocket, Worker.
</details>

---

### 3. Por que SSR melhora SEO e LCP?

<details>
<summary>Resposta</summary>

- **SEO**: crawlers (Googlebot moderno entende JS, mas outros não — Bing, Bing-derived, redes sociais) recebem HTML pronto, com meta tags e conteúdo.
- **LCP**: navegador pinta o conteúdo principal assim que recebe o HTML, sem esperar JS executar e fazer fetch.

Tradeoff: requer servidor Node rodando (mais custo). Para sites de conteúdo, SSG (estático) resolve sem servidor.
</details>

---

### 4. SSR, SSG, SPA, ISR — qual escolher?

<details>
<summary>Resposta</summary>

| Modo | Quando |
|------|--------|
| **SPA** | App logado, intranet, sem SEO importante |
| **SSG** | Blog, docs, marketing — conteúdo muda raramente |
| **SSR** | E-commerce, dashboard público, conteúdo personalizado |
| **ISR** | Híbrido: regenera estática sob demanda (Nuxt: `routeRules`) |

Nuxt 3 permite **misturar** por rota com `routeRules` no nuxt.config.
</details>

---

### 5. O que é hydration mismatch e como evitar?

<details>
<summary>Resposta</summary>

Quando o HTML renderizado no servidor **difere** do que o cliente renderiza na primeira passagem. Vue avisa no console e re-renderiza tudo, perdendo o ganho de SSR.

Causas comuns:
- Uso de `Date.now()`, `Math.random()` na renderização.
- Acesso a `window`/`document`/`localStorage` sem guard.
- Conteúdo dinâmico que depende do horário/locale do cliente.

Soluções:
```vue
<ClientOnly>
  <ComponentQueUsaWindow />
</ClientOnly>
```

Ou guard:
```ts
if (process.client) {
  // só executa no browser
}
```
</details>

---

### 6. Como medir performance real (não só em dev)?

<details>
<summary>Resposta</summary>

- **Lighthouse** no Chrome (modo mobile + throttling).
- **PageSpeed Insights** (dados reais agregados — CrUX).
- **Web Vitals lib** no app real, enviando para analytics.

```ts
import { onCLS, onINP, onLCP } from 'web-vitals'
onCLS(sendToAnalytics)
onINP(sendToAnalytics)
onLCP(sendToAnalytics)
```

Métricas em dev podem mentir — máquina rápida, sem throttling. Sempre teste em mobile real ou simulado.
</details>

---

### 7. Quando `v-memo` realmente ajuda?

<details>
<summary>Resposta</summary>

Em listas **grandes** (centenas/milhares de itens) onde o conteúdo de cada item muda pouco.

```vue
<li v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <ItemComplexo :item="item" />
</li>
```

Se a array tem 20 itens, `v-memo` é desperdício de complexidade. Meça antes de aplicar.
</details>

---

### 8. Por que separar vendors em chunks?

<details>
<summary>Resposta</summary>

Vendors (vue, vue-router, libs UI) **mudam raramente**. Em chunks separados, o navegador cacheia eles. Quando você lança nova versão do seu código, o usuário baixa só o chunk de **app**, mantendo vendors do cache.

Sem essa separação, cada deploy invalida tudo — usuário re-baixa Vue inteiro.
</details>

---

### 9. Como Vite difere de Webpack?

<details>
<summary>Resposta</summary>

- **Dev**: Vite serve módulos ESM nativos para o browser — não bundlea. Por isso é **instantâneo**.
- **Build**: ambos usam Rollup (Vite por baixo) ou webpack — bundle real para produção.
- **HMR**: Vite atualiza só o módulo mudado em milissegundos; Webpack precisa recompilar grafos.

Vite venceu como padrão por velocidade em dev. Webpack ainda aparece em projetos legacy ou casos específicos (micro-frontends com Module Federation).
</details>

---

### 10. Quando usar `<Suspense>` em SSR?

<details>
<summary>Resposta</summary>

Quando você tem componentes async que precisam carregar **antes do HTML ser enviado**:

```vue
<Suspense>
  <UserDashboard />   <!-- async setup() -->
  <template #fallback>Carregando...</template>
</Suspense>
```

Em Nuxt, `await useFetch(...)` já lida com isso automaticamente — você raramente escreve `<Suspense>` direto.
</details>

---

### 11. `useFetch` vs `useAsyncData` no Nuxt?

<details>
<summary>Resposta</summary>

- `useFetch(url)`: wrapper de `useAsyncData + $fetch` para chamar URLs.
- `useAsyncData(key, fn)`: forma genérica — você passa qualquer função async.

```ts
const { data } = await useFetch('/api/users')

// equivalente
const { data } = await useAsyncData('users', () => $fetch('/api/users'))
```

Use `useAsyncData` quando precisa de transformação, múltiplas chamadas combinadas, ou quando a função não é um simples fetch.
</details>

---

### 12. Como evitar leaks em SSR?

<details>
<summary>Resposta</summary>

Em SSR, **estado global é compartilhado entre requests** se mal implementado.

- Stores Pinia: use uma instância **por request** (`createPinia()` no plugin do Nuxt — Nuxt já faz).
- Singletons: nunca crie no top-level do módulo. Crie dentro de plugin ou composable.
- Variáveis globais: cuidado com `window`-like state no servidor.

Pinia + Nuxt fazem isso automaticamente — só não tente "otimizar" criando store fora do `defineStore`.
</details>
