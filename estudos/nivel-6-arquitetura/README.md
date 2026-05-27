# Nível 6 — Arquitetura, Internals e Especialização

Aqui não há receita única. O foco muda de "como fazer" para **"por que fazer assim"**.

## Objetivos

- Aplicar Clean Architecture / Hexagonal no front.
- Construir e escalar um design system.
- Entender internals do Vue (compiler, reactivity, renderer).
- Lidar com micro-frontends e Web Components.
- Contribuir com o ecossistema open source.

## Clean Architecture no frontend

Separe a app em camadas com **dependências apontando para dentro**:

```
src/
  domain/           # entidades, regras de negócio puras (sem Vue!)
    User.ts
    Cart.ts
  application/      # casos de uso (orquestram domain)
    LoginUseCase.ts
    AddItemToCartUseCase.ts
  infrastructure/   # adaptadores (HTTP, storage, libs externas)
    HttpUserRepository.ts
    LocalStorageCartRepository.ts
  presentation/     # Vue: components, stores, composables
    components/
    stores/
    views/
```

### Repository pattern
```ts
// domain/repositories/UserRepository.ts
export interface UserRepository {
  findById(id: number): Promise<User>
  create(input: CreateUserInput): Promise<User>
}

// infrastructure/HttpUserRepository.ts
export class HttpUserRepository implements UserRepository {
  constructor(private http: AxiosInstance) {}
  async findById(id: number) {
    const { data } = await this.http.get(`/users/${id}`)
    return UserMapper.toDomain(data)
  }
  async create(input: CreateUserInput) {
    const { data } = await this.http.post('/users', UserMapper.toDTO(input))
    return UserMapper.toDomain(data)
  }
}
```

### DTOs e Mappers
DTOs são a forma da API. Domain entities são a forma do seu negócio. Mappers convertem.

```ts
// DTO ≠ Domain: nunca exponha DTO direto na UI
type UserDTO = { id: number; full_name: string; created_at: string }
type User = { id: number; name: string; createdAt: Date }

const UserMapper = {
  toDomain(dto: UserDTO): User {
    return { id: dto.id, name: dto.full_name, createdAt: new Date(dto.created_at) }
  }
}
```

**Benefício**: API muda? Você ajusta o mapper, o resto do código não vê.

## Design System

Mais que uma lib de componentes — é **contrato visual + comportamental** da empresa.

### Pilares
1. **Tokens**: cores, espaçamentos, tipografia em variáveis CSS / JS.
2. **Componentes primitivos** (atômicos): Button, Input, Icon.
3. **Composições** (moleculares): SearchInput, Card.
4. **Padrões** (organismos): NavBar, DataTable.
5. **Templates / layouts**: page shells.
6. **Documentação viva**: Storybook + exemplos copy-pasteable.
7. **Testes**: unit + visual regression (Chromatic / Percy).

### Storybook
```bash
npx storybook@latest init
```

```ts
// Button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from './Button.vue'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'danger'] }
  }
}
export default meta

export const Primary: StoryObj<typeof Button> = {
  args: { variant: 'primary', label: 'Click me' }
}
```

## Internals do Vue

### Como funciona a reatividade
Vue 3 usa **Proxy**:

```ts
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)             // registra dependência
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)           // dispara efeitos
      return true
    }
  })
}
```

- `track`: lembra qual efeito (componente, computed, watch) está lendo aquela chave.
- `trigger`: re-executa todos os efeitos que dependiam da chave alterada.
- `effect`: função reativa (re-roda quando deps mudam).

### Compilador
SFC `.vue` → `script` + `template` + `style` extraídos. Template vira uma `render function`:

```vue
<template>
  <div class="card">{{ title }}</div>
</template>
```

Compila para algo como:
```js
function render(_ctx, _cache) {
  return _createElementVNode("div", { class: "card" }, _toDisplayString(_ctx.title), 1 /* TEXT */)
}
```

O número `1` é uma **patch flag** — indica que só o texto pode mudar. Vue pula comparação dos atributos no diff.

### Virtual DOM e patch flags
- Vue 3 usa um diff "compiler-informed" — patch flags reduzem o trabalho do diff drasticamente.
- Static hoisting: nós estáticos saem do render e ficam constantes no módulo.

Para estudar mais, leia `packages/runtime-core/src/renderer.ts` em `vuejs/core`.

### Renderer customizado
Você pode criar um renderer Vue para qualquer "DOM-like" (canvas, terminal, native UI).

```ts
import { createRenderer } from '@vue/runtime-core'

const renderer = createRenderer({
  createElement(tag) { /* ... */ },
  insert(child, parent) { /* ... */ },
  remove(child) { /* ... */ },
  patchProp(el, key, prevValue, nextValue) { /* ... */ }
  // ... + outros hooks
})

const app = renderer.createApp(MyComponent)
app.mount(rootCanvasNode)
```

Projetos reais: **Lottie-Vue**, **TresJS** (Vue para Three.js), **InkVue** (terminal UI).

## Micro-frontends

### Estratégias

1. **Module Federation** (Webpack 5 / Vite plugin) — apps separados que carregam módulos um do outro em runtime.
2. **single-spa / Piral** — orquestradores agnósticos de framework.
3. **Web Components** — exportar componente Vue como Custom Element nativo, consumível em React/Angular/vanilla.

### Web Component a partir de Vue
```ts
import { defineCustomElement } from 'vue'
import MyWidget from './MyWidget.ce.vue'

const Widget = defineCustomElement(MyWidget)
customElements.define('my-widget', Widget)

// Uso em qualquer HTML:
// <my-widget name="Ana"></my-widget>
```

Use `.ce.vue` para SFCs destinados a custom elements (estilo encapsulado em shadow DOM).

## Monorepo

```bash
# pnpm workspaces
npm install -g pnpm
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Estrutura típica:
```
monorepo/
  apps/
    web/             # app principal (Nuxt ou Vue+Vite)
    admin/           # painel admin
  packages/
    ui/              # design system
    utils/           # funções utilitárias
    config/          # ESLint, TS configs compartilhadas
```

Combine com **Turborepo** ou **Nx** para cache de builds.

## Observabilidade no frontend

- **Sentry** ou similar: captura erros JS, traces de performance.
- **OpenTelemetry**: padrão aberto para tracing distribuído.
- **LogRocket / FullStory**: gravação de sessão (cuidado com LGPD).

```ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration({ router })],
  tracesSampleRate: 0.1
})
```

## Próximos passos

Não há "próximo nível". O caminho daqui:
1. **Contribuir** com `vuejs/core`, `pinia`, `vue-router` ou qualquer lib do ecossistema.
2. **Escrever sobre** o que aprendeu (blog, posts, talks).
3. **Mentorar** quem está nos níveis 1–4.
4. **Construir produtos** — a melhor forma de continuar aprendendo.

Veja os [desafios](desafios.md) e [Q&A](perguntas-respostas.md).
