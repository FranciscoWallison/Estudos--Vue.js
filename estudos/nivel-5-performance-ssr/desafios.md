# Nível 5 — Desafios

## Desafio 5.1 — Lista virtualizada
Renderize uma lista de **50.000 itens** sem travar o browser.

**Critérios:**
- Use `vue-virtual-scroller` ou implemente do zero com `IntersectionObserver`.
- Scroll suave a 60fps (verifique no Performance tab do DevTools).
- Suporte a busca/filtro sem perder performance.
- Item com altura dinâmica (use `DynamicScroller`).
- Comparação antes/depois com print do FPS.

## Desafio 5.2 — Otimizar bundle
Pegue o Dashboard do desafio 3.6/4.1 e reduza o bundle inicial em pelo menos 40%.

**Critérios:**
- Rodar `rollup-plugin-visualizer` antes e depois.
- Lazy load de todas as rotas.
- Code splitting de vendors (vue, router, pinia, ui-lib).
- Substituir libs grandes por equivalentes menores (ex: dayjs no lugar de moment).
- Tree-shaking ativo: imports nomeados em vez de `import *`.
- Mostrar diff de tamanho no README.

## Desafio 5.3 — Lighthouse 90+
Faça uma página de produto carregar com Lighthouse Performance ≥ 90.

**Critérios:**
- Imagens com `loading="lazy"`, `width`/`height` definidos e formatos modernos (WebP/AVIF).
- Fontes com `font-display: swap` e preload.
- Critical CSS inline (Vite faz boa parte automaticamente).
- LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Print do Lighthouse antes e depois.

## Desafio 5.4 — `customRef` debounce
Crie um composable `useDebouncedRef` e use em um campo de busca.

**Critérios:**
- `customRef` com debounce configurável.
- Função `cancel()` para cancelar pendente.
- Funciona com `v-model` direto.
- Testes unitários com `vi.useFakeTimers()`.

## Desafio 5.5 — Gráfico com `shallowRef` + `markRaw`
Adicione um gráfico (Chart.js ou ApexCharts) ao dashboard que atualiza com dataset grande.

**Critérios:**
- Instância do chart em `markRaw` (não tornar reativa).
- Dataset em `shallowRef` — substituir o objeto inteiro ao atualizar.
- Performance: re-render do gráfico em < 100ms com 10k pontos.
- Cleanup correto em `onUnmounted` (destruir instância).

## Desafio 5.6 — Migrar SPA → Nuxt
Migre o Blog do desafio 3.1/3.2 para Nuxt 3 com SSR.

**Critérios:**
- File-based routing equivalente.
- `useFetch` substitui chamadas axios diretas no componente.
- `useHead` para SEO em cada rota.
- Server routes (`server/api/`) para endpoints próprios.
- Build com `nuxt build` funciona.
- View source mostra HTML completo (não só `<div id="__nuxt">`).

## Desafio 5.7 — SSG com Nuxt
Configure o blog como **estático** (SSG): páginas pré-renderizadas no build.

**Critérios:**
- `nuxt generate` produz `dist/` deployável em qualquer hosting estático.
- Todas as rotas (incluindo `/posts/:id`) estão no output.
- Sitemap.xml gerado automaticamente.
- Deploy em Netlify/Vercel/GitHub Pages funcionando.

## Desafio 5.8 — PWA
Transforme o dashboard em PWA instalável.

**Critérios:**
- `vite-plugin-pwa` configurado.
- Manifest com ícones (192, 512, maskable).
- Service worker com estratégia de cache `cacheFirst` para assets estáticos.
- Banner de "Instalar app" quando suportado.
- Funciona offline (rota cacheada serve HTML básico).

## Desafio 5.9 — Library mode
Extraia 3 dos seus componentes (`<BaseButton>`, `<Modal>`, `<DataTable>`) para uma lib npm interna.

**Critérios:**
- Build em CJS, ESM e UMD.
- Tipos `.d.ts` gerados (use `vite-plugin-dts`).
- `vue` como `peerDependency`, não dependency.
- `package.json` com `exports` modernos.
- Publicar no npm (private ou scoped) e instalar em um app de teste.
