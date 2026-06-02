# Ferramentas — o ecossistema ao redor do Vue

> Vue sozinho é só a biblioteca. Um projeto real usa um **conjunto de ferramentas**.
> Aqui está o mapa: o que é cada uma, para que serve e em que nível do roadmap entra.

---

## O essencial (nível 1)

| Ferramenta | O que é | Por que você precisa |
|-----------|---------|----------------------|
| **Node.js** | runtime de JS fora do navegador | roda o Vite, o npm, os testes |
| **npm** (ou pnpm/yarn) | gerenciador de pacotes | instala dependências, roda scripts |
| **Vite** | build tool + dev server | compila `.vue`, hot-reload instantâneo, build de produção |
| **Vue DevTools** | extensão do navegador | inspecionar componentes, estado reativo, eventos |

### Node + npm — o básico

```bash
node -v        # confira a versão (ideal: 20+)
npm -v
```

`npm` faz 3 coisas no dia a dia:

```bash
npm install            # instala tudo do package.json (cria node_modules/)
npm install axios      # adiciona uma dependência
npm run dev            # roda um script definido no package.json
```

### Vite — o coração do projeto

É o que torna o desenvolvimento moderno agradável. Scripts típicos (no `package.json`):

```jsonc
"scripts": {
  "dev":     "vite",           // sobe servidor em http://localhost:5173 com hot-reload
  "build":   "vite build",     // gera a pasta dist/ otimizada para produção
  "preview": "vite preview"    // serve a dist/ localmente, p/ testar o build
}
```

Por que Vite e não Webpack? **Velocidade.** O Vite usa ES modules nativos no dev
(start quase instantâneo) e Rollup no build. É o padrão oficial do Vue 3 hoje
(o antigo Vue CLI/Webpack que aparece em `atividades/vue-ati-3` está aposentado).

### Vue DevTools — seus olhos

Instale a extensão no Chrome/Firefox/Edge (ou use o painel embutido do Vite).
Com ela você:

- vê a **árvore de componentes** e as props/estado de cada um;
- inspeciona valores **reativos** (`ref`, `computed`) em tempo real;
- acompanha **eventos** emitidos e mudanças de estado (e do Pinia/Router).

---

## Criando um projeto (o jeito oficial)

```bash
npm create vue@latest meu-app
```

O assistente pergunta o que incluir. Para o **nível 1**, responda **No** a tudo.
Conforme avança no roadmap, vá ativando:

| Opção do assistente | O que adiciona | Entra no nível |
|---------------------|----------------|----------------|
| TypeScript | tipagem estática | 4 |
| JSX | sintaxe JSX (opcional) | — |
| **Vue Router** | navegação entre páginas | 3 |
| **Pinia** | estado global | 3 |
| **Vitest** | testes unitários | 4 |
| Playwright/Cypress | testes E2E | 4 |
| **ESLint** | análise de código | 4 |
| **Prettier** | formatação automática | 4 |

---

## Bibliotecas do ecossistema (níveis 3+)

| Ferramenta | Categoria | Para quê |
|-----------|-----------|----------|
| **Vue Router** | navegação | rotas, params, guards, lazy loading |
| **Pinia** | estado global | substituto oficial do Vuex |
| **Axios** | HTTP | requisições, interceptors, refresh token |
| **VeeValidate + Zod/Yup** | formulários | validação declarativa |
| **Vuetify / PrimeVue / Quasar / Naive UI** | UI kit | componentes prontos (botões, tabelas, modais) |
| **vue-i18n** | internacionalização | múltiplos idiomas |
| **Nuxt** | meta-framework | SSR/SSG, file-based routing (nível 5) |

---

## Qualidade de código (nível 4)

| Ferramenta | Função |
|-----------|--------|
| **ESLint** | encontra erros e más práticas |
| **Prettier** | formata o código automaticamente (fim das brigas de estilo) |
| **Husky + lint-staged** | roda lint/format antes de cada commit (git hooks) |
| **commitlint** | força mensagens de commit padronizadas (Conventional Commits) |
| **Vitest + Vue Test Utils** | testes unitários de componentes |
| **Playwright / Cypress** | testes end-to-end (simula o usuário no navegador) |

---

## Resumo: a stack mínima de hoje

```
Node 20+  →  npm  →  Vite  →  Vue 3 (SFC)  →  Vue DevTools
                                  │
                  (quando crescer) + Router + Pinia + Axios
                                  │
                       (qualidade) + ESLint + Prettier + Vitest
```

> 🧭 Não tente aprender tudo de uma vez. Domine **Node + npm + Vite + Vue + DevTools**
> primeiro (nível 1–2). O resto entra naturalmente conforme o roadmap.
