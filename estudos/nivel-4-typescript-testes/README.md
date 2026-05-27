# Nível 4 — TypeScript, Testes e Qualidade

Hora de transformar código que "funciona" em código que **resiste à mudança**.

## Objetivos

- Escrever componentes Vue 100% tipados em TypeScript.
- Testar componentes com Vitest + Vue Test Utils.
- Escrever testes E2E com Playwright.
- Configurar ESLint, Prettier, Husky e CI básica.
- Internacionalizar com `vue-i18n`.

## TypeScript em Vue

### Setup
```bash
npm create vue@latest    # marque "Add TypeScript"
```

### Props tipadas
```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  tags?: string[]
}

// Type-only (recomendado em Vue 3.3+)
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  tags: () => []
})
</script>
```

### Emits tipados
```vue
<script setup lang="ts">
const emit = defineEmits<{
  select: [id: number]
  delete: [id: number, reason: string]
}>()

emit('select', 42)
emit('delete', 42, 'expired')
</script>
```

### Refs tipadas
```ts
import { ref, type Ref } from 'vue'

const count = ref<number>(0)
const user = ref<User | null>(null)
const items = ref<Item[]>([])

const inputEl = ref<HTMLInputElement | null>(null)
```

### Composables tipados
```ts
export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(true)

  fetch(url)
    .then(r => r.json())
    .then(d => data.value = d)
    .catch(e => error.value = e)
    .finally(() => loading.value = false)

  return { data, error, loading }
}

// Uso
const { data } = useFetch<User[]>('/api/users')
//     ^ tipo: Ref<User[] | null>
```

### Pinia tipada
```ts
interface User { id: number; name: string }

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => user.value !== null)

  async function login(email: string, password: string): Promise<void> {
    // ...
  }

  return { user, isLoggedIn, login }
})
```

## Testes unitários — Vitest + Vue Test Utils

### Setup
```bash
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```

```js
// vite.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### Testando componente
```ts
// Counter.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Counter from './Counter.vue'

describe('Counter', () => {
  it('inicia em 0', () => {
    const w = mount(Counter)
    expect(w.text()).toContain('0')
  })

  it('incrementa ao clicar', async () => {
    const w = mount(Counter)
    await w.find('button.inc').trigger('click')
    expect(w.text()).toContain('1')
  })

  it('emite update:count ao incrementar', async () => {
    const w = mount(Counter)
    await w.find('button.inc').trigger('click')
    expect(w.emitted('update:count')).toEqual([[1]])
  })
})
```

### Testando composable
```ts
import { describe, it, expect } from 'vitest'
import { useCounter } from './useCounter'

describe('useCounter', () => {
  it('inicia com valor padrão', () => {
    const { count } = useCounter(5)
    expect(count.value).toBe(5)
  })

  it('incrementa', () => {
    const { count, increment } = useCounter()
    increment()
    expect(count.value).toBe(1)
  })
})
```

### Mocking de APIs (MSW)
```bash
npm install -D msw
```

```ts
// test/server.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.get('/api/users', () => HttpResponse.json([{ id: 1, name: 'Ana' }]))
)
```

## Testes E2E — Playwright

```bash
npm init playwright@latest
```

```ts
// e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('faz login e vê dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'user@test.com')
  await page.fill('[name=password]', 'senha123')
  await page.click('button[type=submit]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Bem-vindo')).toBeVisible()
})
```

## Qualidade — Lint, format, hooks

### ESLint + Prettier
```bash
npm install -D eslint @vue/eslint-config-typescript @vue/eslint-config-prettier prettier
```

```js
// eslint.config.js (flat config)
import vue from 'eslint-plugin-vue'
import ts from '@vue/eslint-config-typescript'
import prettier from '@vue/eslint-config-prettier'

export default [
  ...vue.configs['flat/recommended'],
  ...ts(),
  prettier
]
```

### Husky + lint-staged
```bash
npm install -D husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,vue}": "eslint --fix",
    "*.{ts,vue,css,md}": "prettier --write"
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

### Conventional Commits + commitlint
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js
export default { extends: ['@commitlint/config-conventional'] }
```

```bash
# .husky/commit-msg
npx commitlint --edit $1
```

## i18n

```bash
npm install vue-i18n@9
```

```ts
// src/i18n/index.ts
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: {
    'pt-BR': { hello: 'Olá, {name}!' },
    'en': { hello: 'Hello, {name}!' }
  }
})
```

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
</script>

<template>
  <p>{{ t('hello', { name: 'Ana' }) }}</p>
  <button @click="locale = 'en'">EN</button>
</template>
```

## Próximos passos

[Desafios](desafios.md) → [Q&A](perguntas-respostas.md) → [nível 5](../nivel-5-performance-ssr/).
