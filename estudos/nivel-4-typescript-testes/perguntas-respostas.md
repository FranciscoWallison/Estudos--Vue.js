# Nível 4 — Perguntas e Respostas

---

### 1. Qual a diferença entre `defineProps<T>()` e `defineProps({})`?

<details>
<summary>Resposta</summary>

- `defineProps({ ... })`: forma **runtime** (objeto JS). Vue valida em tempo de execução.
- `defineProps<T>()`: forma **type-only** (TS). Compilador gera a validação automaticamente.

```ts
// Runtime
const props = defineProps({ count: { type: Number, default: 0 } })

// Type-only (preferida em TS)
const props = withDefaults(defineProps<{
  count?: number
}>(), { count: 0 })
```

A versão type-only é mais limpa e segura — recomendada em projetos TS.
</details>

---

### 2. `interface` ou `type` em TypeScript?

<details>
<summary>Resposta</summary>

Quase intercambiáveis. Diferenças:

- `interface` permite **declaration merging** (declarar duas vezes funde).
- `type` permite **uniões, intersections e mapped types**.

```ts
type Status = 'idle' | 'loading' | 'error'   // só com type
interface User { id: number }
interface User { name: string }              // merge: User tem id E name
```

Convenção comum: `interface` para objetos/contratos, `type` para uniões e utilitários.
</details>

---

### 3. Quando usar `unknown` vs `any`?

<details>
<summary>Resposta</summary>

- `any`: desliga o type-checker. **Evite.**
- `unknown`: tipo desconhecido mas seguro — você é forçado a checar antes de usar.

```ts
function parse(input: unknown) {
  if (typeof input === 'string') {
    return input.toUpperCase()  // OK, narrowing
  }
}
```

`any` é uma porta para bugs; `unknown` é uma porta para validação explícita.
</details>

---

### 4. Como tipar um `ref` que pode ser nulo no início?

<details>
<summary>Resposta</summary>

```ts
import { ref } from 'vue'

const user = ref<User | null>(null)
const el = ref<HTMLDivElement | null>(null)

// Antes de usar, narrowing:
if (user.value) {
  console.log(user.value.name)
}
```

Para refs de template, `null` é o estado **antes do mount** — quase sempre você precisa do union com null.
</details>

---

### 5. Por que `shallowMount` em vez de `mount`?

<details>
<summary>Resposta</summary>

- `mount`: renderiza o componente **e todos os filhos**. Mais próximo do real.
- `shallowMount`: stub nos filhos. Útil quando você quer testar **apenas a lógica do componente** sem se importar com o que filhos renderizam.

Prefira `mount` quando possível — testes que se aproximam do uso real pegam mais bugs.
</details>

---

### 6. Como testar componentes que usam Pinia?

<details>
<summary>Resposta</summary>

Crie uma instância de Pinia para cada teste:

```ts
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const w = mount(MyComponent, {
  global: {
    plugins: [createTestingPinia({
      initialState: { auth: { user: { id: 1, name: 'Ana' } } },
      stubActions: false  // por padrão actions viram spies
    })]
  }
})
```

`createTestingPinia` permite estado inicial e stubs de actions — útil para isolar componente de side effects.
</details>

---

### 7. Como testar componentes que usam Vue Router?

<details>
<summary>Resposta</summary>

Crie um router em memória:

```ts
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }]
})

mount(MyComponent, {
  global: { plugins: [router] }
})

await router.push('/foo')
await router.isReady()
```

Para componentes que **só usam `useRoute()`**, você pode mockar com `vi.mock('vue-router')` em vez de instanciar o router inteiro.
</details>

---

### 8. Vitest ou Jest?

<details>
<summary>Resposta</summary>

Em projetos Vite, **use Vitest**:
- Compartilha config do Vite (paths, plugins).
- Muito mais rápido (HMR para testes).
- API idêntica ao Jest (`describe`, `it`, `expect`, `vi` ≈ `jest`).
- Suporte nativo a ESM e TS.

Jest ainda é válido em projetos Webpack/legacy, mas exige mais setup com Vue 3.
</details>

---

### 9. Por que Conventional Commits?

<details>
<summary>Resposta</summary>

Padrão de mensagem `tipo(escopo): descrição` que permite:
- Geração automática de CHANGELOG.
- Bump semântico de versão (feat → minor, fix → patch, BREAKING → major).
- Histórico legível em busca.

```
feat(auth): adiciona login com Google
fix(cart): corrige cálculo de total com cupom
docs(readme): atualiza instruções de setup
chore(deps): bump axios para 1.6
```

Combinado com `commitlint` (bloqueia commits fora do padrão) e `release-please` (cria releases automáticos).
</details>

---

### 10. O que `tsc --noEmit` faz e por que rodar no CI?

<details>
<summary>Resposta</summary>

`tsc` é o compilador TypeScript. `--noEmit` faz **apenas o type-checking** sem gerar arquivos `.js`.

Por que no CI: o Vite **não faz type-check** durante o build (usa `esbuild` para velocidade). Sem `tsc --noEmit` no pipeline, erros de tipo passam batido.

```json
// package.json
{
  "scripts": {
    "type-check": "vue-tsc --noEmit",
    "build": "vue-tsc --noEmit && vite build"
  }
}
```

Use `vue-tsc` em vez de `tsc` puro — entende `.vue`.
</details>

---

### 11. Diferença entre testes unitários, integração e E2E?

<details>
<summary>Resposta</summary>

- **Unitário**: testa uma função/composable isolado. Rápido, muitos.
- **Integração**: testa um componente com filhos/store/router mockados parcialmente. Médio.
- **E2E**: testa o app no browser real, do clique do usuário ao DOM final. Lento, poucos.

**Pirâmide ideal**: muitos unitários, alguns integração, poucos E2E (críticos: login, checkout, fluxo principal).
</details>

---

### 12. Como configurar `pre-push` hook para rodar testes?

<details>
<summary>Resposta</summary>

```bash
# .husky/pre-push
npm run test
```

Cuidado: testes longos atrapalham o fluxo do desenvolvedor. Boa prática:
- `pre-commit`: só lint + format + type-check (rápido).
- `pre-push`: testes (médio).
- **CI**: testes + E2E + build (completo).

Permita bypass emergencial com `--no-verify` documentado, mas só para hotfix.
</details>
