# Nível 6 — Perguntas e Respostas

---

### 1. Por que separar `domain` de `presentation`?

<details>
<summary>Resposta</summary>

Para **isolar regras de negócio** da tecnologia que está sendo usada para exibi-las.

- Se você trocar Vue por React amanhã, o `domain/` continua igual.
- Testes do domain são puros (sem montar componentes, sem mockar Vue).
- Mais fácil de raciocinar: lógica de negócio em um lugar, não espalhada em componentes e stores.

Tradeoff: mais arquivos, mais cerimônia. Vale a pena em apps **médios e grandes**. Em projetos pequenos, é overengineering.
</details>

---

### 2. Quando criar um Repository Pattern?

<details>
<summary>Resposta</summary>

Quando você quer **desacoplar** o acesso a dados da regra de negócio.

Cenários onde vale:
- API pode mudar de REST para GraphQL.
- Mesma entidade vem de fontes diferentes (API + IndexedDB local).
- Testes unitários de use cases sem subir API mock.

Em CRUDs simples, axios direto no store é OK — não force o padrão por estética.
</details>

---

### 3. Diferença entre DTO e Entity?

<details>
<summary>Resposta</summary>

- **DTO** (Data Transfer Object): forma dos dados **na transmissão** (request/response da API).
- **Entity**: forma do dado **no domínio** da sua aplicação.

Exemplo:
```ts
// DTO — vem da API
type UserDTO = { user_full_name: string; dob: string }

// Entity — usado na app
type User = { fullName: string; birthDate: Date }
```

Por que separar: API pode usar snake_case, datas como string, etc. Você não quer isso vazando para componentes.
</details>

---

### 4. Design System: monorepo ou repos separados?

<details>
<summary>Resposta</summary>

**Monorepo** quase sempre vence:
- Mudança no DS e adoção pelos apps no mesmo PR.
- Tipos compartilhados sem publicar npm a cada commit.
- Refactor cross-package com um único `find/replace`.

Repos separados fazem sentido quando o DS é consumido por **organizações externas** (open source ou múltiplas empresas).
</details>

---

### 5. Como Vue 3 detecta mudanças sem getters/setters manuais?

<details>
<summary>Resposta</summary>

Usa **Proxy** (ES2015) — intercepta operações de leitura (`get`) e escrita (`set`) em objetos.

```js
const proxy = new Proxy(target, {
  get(t, key) { /* track */ return t[key] },
  set(t, key, value) { t[key] = value; /* trigger */ return true }
})
```

Vantagens sobre Vue 2 (que usava `Object.defineProperty`):
- Detecta adição/remoção de propriedades.
- Funciona com arrays sem hack (em Vue 2, `arr[0] = x` não disparava).
- Suporta Map, Set, WeakMap, WeakSet.

Limitação: Proxy não é polyfillable. Vue 3 não suporta IE11.
</details>

---

### 6. O que são patch flags no Vue 3?

<details>
<summary>Resposta</summary>

Hints gerados em **tempo de compilação** que informam ao runtime **o que** em um VNode pode mudar.

```js
_createElementVNode("div", null, _toDisplayString(name), 1 /* TEXT */)
```

`1` = só o texto pode mudar. No diff, Vue pula a comparação de classe, estilo, atributos.

Outras flags: CLASS (2), STYLE (4), PROPS (8), FULL_PROPS (16), HYDRATE_EVENTS (32), STABLE_FRAGMENT (64).

Resultado: diff drasticamente mais rápido que Vue 2.
</details>

---

### 7. Quando faz sentido criar um renderer custom?

<details>
<summary>Resposta</summary>

Quando você quer aproveitar **a Composition API + reatividade do Vue** em um ambiente que não é DOM:

- Three.js / Canvas / SVG (TresJS, Vue3-Konva).
- Terminal (InkVue).
- Apps nativos (NativeScript-Vue, embora ele use renderer próprio).

Para 99% dos casos, o DOM renderer já cobre. Renderer custom é projeto de pesquisa/lib específica.
</details>

---

### 8. Micro-frontends: quando vale e quando não?

<details>
<summary>Resposta</summary>

**Vale quando:**
- Times grandes (10+ devs) com domínios bem definidos.
- Deploys independentes são críticos.
- Tecnologias diferentes precisam coexistir (legado React + novo Vue).

**Não vale quando:**
- Time pequeno — você adiciona complexidade sem ganho.
- Mesma stack em todos os apps — monorepo resolve melhor.
- Performance importa muito — micro-frontends têm overhead.

Conway's Law: a arquitetura tende a refletir a estrutura da organização. Se você tem 1 time, faça 1 app.
</details>

---

### 9. Web Components vs componente Vue normal — quando exportar como CE?

<details>
<summary>Resposta</summary>

Exporte como Custom Element quando:
- O componente será consumido em apps de **outros frameworks** (React, Angular, vanilla).
- Você precisa de **encapsulamento total de estilo** (shadow DOM).
- Constrói um widget embebível em sites de terceiros.

Limitações:
- Reatividade entre CE e o app pai é mais complicada (atributos são string).
- Slots e events funcionam, mas com sintaxe HTML, não Vue.
- SSR de Web Components ainda é experimental.

Componente Vue normal é mais ergonômico **dentro** do ecossistema Vue.
</details>

---

### 10. Qual a vantagem de monorepo com pnpm vs Lerna ou npm workspaces?

<details>
<summary>Resposta</summary>

- **pnpm workspaces**: muito mais rápido, deduplica deps com hard links, hoisting estrito (evita "phantom deps").
- **npm workspaces**: nativo, sem deps externas, mas mais lento.
- **Lerna**: deprecated do ponto de vista prático; o time recomenda usar com Nx hoje.

Em 2025+, o padrão de fato em Vue/Nuxt/Vite é **pnpm workspaces + Turborepo (ou Nx)**.
</details>

---

### 11. Como tomar decisões de arquitetura em time?

<details>
<summary>Resposta</summary>

Crie **ADRs** (Architecture Decision Records):

```
docs/adr/
  0001-usar-pinia-no-lugar-de-vuex.md
  0002-clean-architecture-no-modulo-billing.md
```

Cada ADR responde:
1. **Contexto** — qual problema, quais opções.
2. **Decisão** — o que foi escolhido.
3. **Consequências** — tradeoffs, o que aceitamos.

Vantagens:
- Documenta o **porquê**, não só o quê.
- Quem entrar no time depois entende a história.
- Decisão pode ser **revisada** com mais contexto futuro.
</details>

---

### 12. Como evitar "Big Ball of Mud" em apps grandes?

<details>
<summary>Resposta</summary>

Boas práticas que escalam:
- **Modularize por feature** (não por tipo). `users/`, `cart/`, `auth/` em vez de `components/`, `stores/`, `services/`.
- **Boundaries explícitos**: cada módulo expõe APIs públicas via `index.ts`. Devs evitam imports diretos de internals.
- **Lint rules** bloqueiam imports cross-module errados (ESLint `import/no-restricted-paths`).
- **Code review** com foco em "esse import faz sentido?".
- **Refactor periódico** — não deixe acumular dívida; reserve tempo na sprint.

Lei de Brooks: software degrada com o tempo se ninguém zelar.
</details>

---

### 13. Como manter um projeto Vue saudável a longo prazo?

<details>
<summary>Resposta</summary>

- **Atualizações regulares**: Vue, Vite, libs UI a cada minor.
- **Renovate / Dependabot** para PRs automáticos de bump.
- **Testes** — habilitam refactor sem medo.
- **Tipos rigorosos**: `strict: true`, `noUncheckedIndexedAccess: true`.
- **Métricas**: bundle size, Lighthouse, error rate em produção.
- **Time alinhado**: padrões documentados, onboarding com pair programming.

O maior risco em projetos longos não é tecnologia — é **falta de manutenção contínua**.
</details>
