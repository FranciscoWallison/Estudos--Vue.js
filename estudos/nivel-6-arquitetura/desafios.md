# Nível 6 — Desafios

> Desafios abertos. Não há "resposta certa" — há **decisões de arquitetura** que você precisa justificar.

## Desafio 6.1 — Refatorar com Clean Architecture
Pegue o Dashboard do desafio 3.6/4.1 e reorganize em camadas (domain / application / infrastructure / presentation).

**Critérios:**
- Pastas `domain/`, `application/`, `infrastructure/`, `presentation/`.
- `domain/` não importa nada do Vue.
- Repositórios definidos como interfaces em `domain`, implementados em `infrastructure`.
- Use cases em `application` orquestram repositórios.
- Stores Pinia só chamam use cases.
- DTOs e Mappers separados.
- README explica a arquitetura com diagrama.

## Desafio 6.2 — Design System interno
Construa uma lib `@empresa/ui` com 10 componentes documentados.

**Critérios:**
- Monorepo pnpm com `apps/playground` consumindo `packages/ui`.
- Storybook com stories para cada componente (states, variants).
- Tokens em CSS variables (`--color-primary`, etc).
- Tema claro/escuro via tokens.
- Testes visuais com Chromatic ou Playwright `toHaveScreenshot`.
- README com guia "primeiros passos para devs".
- Publicado (ou simulando publicação) em npm/Verdaccio local.

## Desafio 6.3 — Renderer custom
Escreva um renderer Vue que desenha em **canvas 2D** (ou terminal com `blessed`).

**Critérios:**
- Use `createRenderer` do `@vue/runtime-core`.
- Componente declarativo: `<Rect>`, `<Circle>`, `<Text>`.
- Reatividade funciona — mudar uma `ref` redesenha o canvas.
- Lifecycle (`onMounted`, `onUnmounted`) opera.
- Demo: relógio digital ou jogo simples (snake) declarativo.

## Desafio 6.4 — Web Component Vue
Empacote um widget Vue como Custom Element consumível em qualquer HTML.

**Critérios:**
- `.ce.vue` com `defineCustomElement`.
- Atributos HTML reativos (kebab-case).
- Eventos custom propagados (`new CustomEvent`).
- Styling encapsulado (shadow DOM).
- Demo em HTML puro **e** em outra app (React/Angular/Svelte).
- Build npm distribuível.

## Desafio 6.5 — Micro-frontend
Construa 2 apps Vue independentes que compartilham um header e um state de auth via Module Federation (vite-plugin-federation).

**Critérios:**
- App `host` orquestrador.
- Apps `remoto-1` (carrinho) e `remoto-2` (catálogo) deployados separadamente.
- Header é exposto pelo host e consumido pelos remotos.
- Auth state compartilhado (custom event, BroadcastChannel ou store federada).
- Cada app sobe em porta diferente e build separado.
- README explica trade-offs vs SPA monolítica.

## Desafio 6.6 — Plugin Vue
Crie um plugin reutilizável (ex: `vue-feature-flags`).

**Critérios:**
- `app.use(FeatureFlagsPlugin, { provider: ... })`.
- Composable `useFeatureFlag('flag-name')`.
- Diretiva `v-feature` que oculta elementos.
- TypeScript com declaração de módulo (`declare module 'vue'`) para tipar `$featureFlag` global se quiser.
- Publicado em npm com README, testes, GitHub Actions.

## Desafio 6.7 — Contribuição open source
Faça uma contribuição **real** para um projeto Vue.

**Sugestões de onde começar:**
- `vuejs/core` — issues `good first issue`.
- `vuejs/router`, `vuejs/pinia`, `nuxt/nuxt`.
- VueUse, Vite, Vitest.

**Critérios:**
- Issue identificada, discussão lida, PR aberto.
- Testes adicionados.
- CI passa.
- Code review respondido com revisões aplicadas.
- Merge não é obrigatório — o aprendizado está no processo.

## Desafio 6.8 — Profundão nos internals
Leia o código de `packages/reactivity/src/effect.ts` em `vuejs/core` e **reescreva uma versão minimalista** do zero.

**Critérios:**
- Funções: `reactive`, `ref`, `effect`, `computed`, `watch`.
- ~200 linhas, todas comentadas.
- Testes mostrando que funciona como o Vue real em casos básicos.
- Blog post / README explicando como o tracking funciona, com diagramas.

Este desafio é o "Ph.D" em Vue — ao concluir, você entende a alma do framework.
