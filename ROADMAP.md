# Roadmap de Estudos — Vue.js (Iniciante → Avançado)

Estrutura progressiva para dominar Vue.js 3, do zero ao nível de arquitetura de aplicações em produção. Cada nível tem **conceitos**, **prática sugerida** e **critério de "concluído"**.

---

## Nível 0 — Pré-requisitos

Antes de tocar em Vue, você precisa estar confortável com:

- **HTML5 semântico** — tags, atributos, formulários, acessibilidade básica.
- **CSS** — seletores, Flexbox, Grid, posicionamento, responsividade.
- **JavaScript moderno (ES6+)** — `let`/`const`, arrow functions, destructuring, spread/rest, módulos `import/export`, `Promise`, `async/await`, `fetch`, métodos de array (`map`, `filter`, `reduce`).
- **Terminal + Git** — comandos básicos, branches, commits, push/pull.
- **Node.js + npm/pnpm/yarn** — instalar pacotes, rodar scripts.

**Concluído quando:** consegue construir uma página estática com JS puro consumindo uma API e exibindo resultados na tela.

---

## Nível 1 — Iniciante (Fundamentos do Vue 3)

### Conceitos
- O que é Vue, comparação com React/Angular, MVVM e reatividade.
- Criando projetos: **CDN**, **Vite** (`npm create vue@latest`).
- Estrutura de um SFC (Single File Component): `<template>`, `<script setup>`, `<style>`.
- **Options API vs Composition API** (foque em Composition API com `<script setup>`).
- **Reatividade**: `ref`, `reactive`, `computed`, `watch`, `watchEffect`.
- **Template syntax**: interpolação `{{ }}`, binding `v-bind` / `:`, eventos `v-on` / `@`.
- **Diretivas built-in**: `v-if`, `v-else`, `v-show`, `v-for`, `v-model`, `v-html`.
- **Class e style binding** dinâmicos.
- **Lifecycle hooks**: `onMounted`, `onUpdated`, `onUnmounted`, `onBeforeMount`.
- **Eventos** e modificadores (`.stop`, `.prevent`, `.once`).

### Prática
1. **Contador** com botões +/- e reset.
2. **Lista de tarefas (To-Do)** com adicionar, remover, marcar como concluído.
3. **Conversor de moedas** consumindo uma API pública.
4. **Galeria de fotos** com filtro por categoria.

**Concluído quando:** cria um SPA simples com 3+ componentes que conversam entre si e consome uma API REST.

---

## Nível 2 — Iniciante-Intermediário (Componentes em profundidade)

### Conceitos
- **Props**: tipagem, validação, valores default, `defineProps`.
- **Emits**: `defineEmits`, eventos customizados, tipagem.
- **`v-model` em componentes** (incluindo múltiplos v-models — Vue 3).
- **Slots**: default, named slots, scoped slots, `<slot>` fallback.
- **Provide / Inject** para evitar prop drilling.
- **Refs em templates** (`ref="el"`) e `defineExpose`.
- **Componentes dinâmicos** (`<component :is="...">`), `<KeepAlive>`, `<Transition>`.
- **Async components** e code splitting com `defineAsyncComponent`.
- **Composables** (composition functions) — extrair lógica reutilizável (`useFetch`, `useLocalStorage`).

### Prática
1. **Modal genérico** com slots para header/body/footer.
2. **Componente de tabela** que aceita colunas e dados via props + slot scoped para renderização customizada.
3. **Composable `useFetch`** com loading, error e data.
4. **Sistema de tabs** com componentes dinâmicos e `<KeepAlive>`.

**Concluído quando:** consegue projetar uma biblioteca interna de componentes reutilizáveis e desacoplados.

---

## Nível 3 — Intermediário (Ecossistema)

### Conceitos
- **Vue Router 4**
  - Rotas dinâmicas, params, query, nested routes.
  - Lazy loading de rotas.
  - Guards: `beforeEach`, `beforeEnter`, `beforeRouteLeave`.
  - Meta fields, rotas nomeadas, programmatic navigation.
- **Gerenciamento de estado com Pinia** (substituto oficial do Vuex)
  - Stores, state, getters, actions.
  - Composição de stores, persistência (`pinia-plugin-persistedstate`).
  - Comparação Pinia vs Vuex vs Composables com `provide/inject`.
- **Formulários**
  - Validação com **VeeValidate** + **Yup/Zod**.
  - Máscaras, debounce, submit handlers.
- **HTTP** com **Axios** (interceptors, instâncias, refresh token).
- **UI Frameworks**: Vuetify, PrimeVue, Quasar, Element Plus, Naive UI, shadcn-vue.

### Prática
1. **Dashboard administrativo** com autenticação fake (login, rotas protegidas, logout).
2. **CRUD completo** consumindo uma API (JSONPlaceholder, Fake Store API ou backend próprio).
3. **Carrinho de compras** com Pinia, persistido no localStorage.
4. **Formulário multi-step** com validação por etapa.

**Concluído quando:** entrega uma aplicação real com autenticação, navegação, estado global e formulários validados.

---

## Nível 4 — Intermediário-Avançado (TypeScript + Testes + Qualidade)

### Conceitos
- **TypeScript em Vue**
  - Tipagem de props/emits com `defineProps<T>()` / `defineEmits<T>()`.
  - Tipagem de stores Pinia.
  - `PropType`, generics em composables.
- **Testes**
  - **Unitários**: Vitest + Vue Test Utils — montar componentes, simular eventos, asserções.
  - **E2E**: Playwright ou Cypress.
  - Cobertura, mocking de APIs (MSW), snapshot testing.
- **Qualidade de código**
  - ESLint + Prettier + Stylelint.
  - Husky + lint-staged + commitlint (Conventional Commits).
  - Editor config, `.vscode/settings.json` compartilhado.
- **Arquitetura de pastas**: feature-based vs layer-based, barrels, alias `@/`.
- **Acessibilidade (a11y)**: ARIA, foco, leitores de tela, contraste.
- **i18n** com `vue-i18n`.

### Prática
1. **Migrar projeto JS → TS** sem perder funcionalidade.
2. **Atingir 80%+ de cobertura** em um módulo crítico.
3. **App multilíngue** (PT/EN/ES) com lazy loading de locales.

**Concluído quando:** seu projeto tem CI rodando lint + testes, é 100% TS e acessível.

---

## Nível 5 — Avançado (Performance + SSR + Build)

### Conceitos
- **Reatividade profunda**
  - `shallowRef`, `shallowReactive`, `markRaw`, `toRaw`, `triggerRef`.
  - `customRef` para casos especiais (ex: debounce reativo).
  - Como o Vue 3 implementa reatividade com `Proxy`.
- **Performance**
  - `v-memo`, `v-once`.
  - Virtualização de listas (`vue-virtual-scroller`).
  - Code splitting agressivo, prefetch, preload.
  - Análise de bundle (`rollup-plugin-visualizer`).
  - Lighthouse, Core Web Vitals (LCP, CLS, INP).
- **SSR e SSG**
  - **Nuxt 3**: file-based routing, server routes (Nitro), middleware, layouts, `useFetch`, `useAsyncData`.
  - Hidratação, hydration mismatch, `<ClientOnly>`.
  - SEO: meta tags dinâmicas (`useHead`), sitemap, robots.
- **Build avançado**
  - Vite: plugins, config customizada, env vars, modos.
  - PWA com `vite-plugin-pwa`.
  - Monorepo com pnpm workspaces ou Turborepo.

### Prática
1. **Migrar SPA → Nuxt** com SSR.
2. **Otimizar uma app lenta** medindo antes/depois no Lighthouse.
3. **Publicar uma lib de componentes** como pacote npm (build com Vite library mode).

**Concluído quando:** consegue justificar tradeoffs de SSR vs SPA vs SSG, e otimizar um app real para 90+ no Lighthouse.

---

## Nível 6 — Especialista (Arquitetura + Internals)

### Conceitos
- **Padrões arquiteturais**
  - Clean Architecture / Hexagonal aplicada ao frontend.
  - Separação domínio / aplicação / infraestrutura / UI.
  - Repository pattern, DTOs, mappers.
  - Feature flags, A/B testing.
- **Micro-frontends** com Vue (Module Federation, single-spa, Web Components via `defineCustomElement`).
- **Internals do Vue**
  - Compilador: como `.vue` vira `render function`.
  - Virtual DOM, diff algorithm, patch flags.
  - Reactive system: `effect`, `track`, `trigger`.
  - Leitura do código fonte do Vue (repo `vuejs/core`).
- **Renderers customizados** (`createRenderer`) — Vue para canvas, terminal, mobile.
- **Ferramentas avançadas**
  - Storybook para documentação viva de componentes.
  - Chromatic / visual regression testing.
  - Observabilidade: Sentry, OpenTelemetry no frontend.

### Prática
1. **Contribuir** com issue/PR num projeto open source Vue.
2. **Construir um renderer custom** simples (ex: Vue → SVG ou Canvas).
3. **Projetar e implementar** um design system completo com Storybook + testes visuais.

**Concluído quando:** lidera decisões arquiteturais, mentora outros devs e contribui com a comunidade.

---

## Recursos recomendados

### Documentação oficial (sempre primeiro)
- [vuejs.org](https://vuejs.org) — guia + API reference.
- [router.vuejs.org](https://router.vuejs.org).
- [pinia.vuejs.org](https://pinia.vuejs.org).
- [nuxt.com](https://nuxt.com).
- [vitejs.dev](https://vitejs.dev).

### Comunidade
- **Vue School**, **Vue Mastery** — cursos premium.
- **Anthony Fu**, **Evan You**, **Daniel Roe** — devs para seguir.
- Discord oficial do Vue, fórum, Reddit r/vuejs.

### Livros
- *Fullstack Vue* — Hassan Djirdeh.
- *Vue.js 3 Cookbook* — Heitor Ramon.

---

## Como usar este roadmap

1. **Não pule níveis.** A Composition API parece simples mas exige base sólida em JS moderno.
2. **Construa projetos**, não só leia. Cada nível tem prática — faça TODAS.
3. **Commite tudo** no GitHub — vira portfólio.
4. **Tempo estimado**: ~6 a 12 meses para chegar ao Nível 4 estudando 1h/dia. Níveis 5–6 são contínuos.
5. **Reavalie a cada nível**: se algo do anterior não está sólido, volte.
