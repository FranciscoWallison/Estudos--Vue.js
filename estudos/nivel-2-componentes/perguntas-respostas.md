# Nível 2 — Perguntas e Respostas

---

### 1. Por que o `default` de uma prop Array/Object deve ser uma função?

<details>
<summary>Resposta</summary>

Porque objetos/arrays são referências. Se você passar o mesmo objeto como default, **todas as instâncias compartilham a mesma referência** — mutar em uma afeta todas.

```js
// ERRADO
defineProps({ tags: { type: Array, default: [] } })

// CERTO
defineProps({ tags: { type: Array, default: () => [] } })
```

Cada instância chama a função e recebe um array novo.
</details>

---

### 2. Como `v-model` funciona em componentes customizados?

<details>
<summary>Resposta</summary>

Por convenção, recebe a prop `modelValue` e emite `update:modelValue`.

```vue
<!-- Pai -->
<MyInput v-model="text" />

<!-- expande para -->
<MyInput :model-value="text" @update:model-value="text = $event" />
```

No filho, a forma moderna (Vue 3.4+) usa `defineModel`:
```vue
<script setup>
const model = defineModel()  // ref two-way
</script>
<template>
  <input v-model="model" />
</template>
```

Para múltiplos: `defineModel('name')`, `defineModel('age')`.
</details>

---

### 3. Slot default vs named slot vs scoped slot — quando usar cada?

<details>
<summary>Resposta</summary>

- **Default slot**: conteúdo principal do componente (`<slot />`).
- **Named slots**: várias áreas de inserção (`<slot name="header" />`).
- **Scoped slots**: filho **expõe dados** para o pai customizar a renderização.

Use scoped quando o pai precisa renderizar com dados que **só o filho conhece** — ex: tabela genérica que precisa renderizar a célula com o valor de cada linha.
</details>

---

### 4. Qual a diferença entre `provide/inject` e Pinia?

<details>
<summary>Resposta</summary>

- `provide/inject`: passa valores na **árvore de componentes**. Cada subtree pode ter um provider diferente. Bom para **contexto local** (tema de uma seção, configuração de um wizard).
- **Pinia**: store **global**, acessível de qualquer componente. Bom para estado de aplicação (usuário logado, carrinho).

Se mais de um pedaço da app precisa do dado, use Pinia. Se é específico de uma subtree, use provide/inject.
</details>

---

### 5. O que é um composable e por que usar?

<details>
<summary>Resposta</summary>

Função que **encapsula lógica reativa reutilizável** usando a Composition API. Equivalente aos custom hooks do React.

Vantagens:
- Reusa código entre componentes sem mixins (que têm conflitos de nome).
- Testa em isolamento.
- Mantém o `<script setup>` enxuto.

Convenção: nome começa com `use`. Sempre retorne um objeto com `refs`/`functions`.
</details>

---

### 6. Por que retornar `ref` de um composable em vez de `.value`?

<details>
<summary>Resposta</summary>

Para manter a **reatividade**. Se você retorna `.value`, perde o vínculo:

```js
// ERRADO
function useCounter() {
  const count = ref(0)
  return { count: count.value }  // primitivo desconectado
}

// CERTO
function useCounter() {
  const count = ref(0)
  return { count }  // ainda reativo
}
```
</details>

---

### 7. Quando usar `<Teleport>`?

<details>
<summary>Resposta</summary>

Quando o componente está **logicamente aninhado** mas precisa ser renderizado em outro lugar do DOM. Casos típicos:

- Modais (escapar de `overflow: hidden` ou `z-index` do pai).
- Tooltips e popovers.
- Notificações globais.

```vue
<Teleport to="body">
  <div class="modal">...</div>
</Teleport>
```

O componente continua reativo e recebe props normalmente, mas o HTML aparece em `<body>`.
</details>

---

### 8. O que faz `<KeepAlive>`?

<details>
<summary>Resposta</summary>

Mantém o **estado e o DOM** de componentes que seriam desmontados (ex: ao trocar de tab ou rota). Sem ele, ao remontar o estado é perdido.

```vue
<KeepAlive>
  <component :is="currentTab" />
</KeepAlive>
```

Use `include`/`exclude`/`max` para controlar. Atenção: aumenta uso de memória — não envolva a app inteira.

Componentes mantidos disparam `onActivated` e `onDeactivated` no lugar de `onMounted`/`onUnmounted`.
</details>

---

### 9. Como tipar emits com validação?

<details>
<summary>Resposta</summary>

Use a forma de objeto, onde cada chave é um validador que retorna `boolean`:

```js
const emit = defineEmits({
  submit: (payload) => {
    if (!payload?.email) {
      console.warn('submit requer email')
      return false
    }
    return true
  },
  cancel: null  // sem validação
})
```

Em desenvolvimento, Vue avisa quando a validação falha.
</details>

---

### 10. `<Suspense>` — para que serve?

<details>
<summary>Resposta</summary>

Permite mostrar um fallback (loading) enquanto componentes async carregam. Útil com `async setup()` ou `defineAsyncComponent`.

```vue
<Suspense>
  <template #default>
    <AsyncUserProfile />
  </template>
  <template #fallback>
    <p>Carregando...</p>
  </template>
</Suspense>
```

Ainda é experimental — em apps simples, prefira gerenciar loading manualmente com `ref`.
</details>

---

### 11. `attrs` herdadas — o que são e como controlar?

<details>
<summary>Resposta</summary>

Atributos passados ao componente que **não são props nem emits declarados** caem em `$attrs`. Por padrão, são aplicados no **elemento raiz** do template.

```vue
<!-- MyButton.vue -->
<template>
  <button>{{ label }}</button>
</template>

<!-- Uso -->
<MyButton class="big" data-test="x" />
<!-- "class" e "data-test" vão para o <button> -->
```

Para desativar herança automática:
```vue
<script setup>
defineOptions({ inheritAttrs: false })
</script>
<template>
  <div>
    <button v-bind="$attrs">{{ label }}</button>
  </div>
</template>
```

Útil quando a raiz é um wrapper e os atributos pertencem a um elemento interno.
</details>

---

### 12. Por que `defineExpose` existe?

<details>
<summary>Resposta</summary>

Em `<script setup>`, o componente é **fechado por padrão** — o pai não pode acessar nada via `ref`. `defineExpose` libera o que você quer expor.

```vue
<script setup>
import { ref } from 'vue'
const input = ref(null)
function focus() { input.value.focus() }
defineExpose({ focus })
</script>
```

```vue
<!-- Pai -->
<MyInput ref="myInput" />
<script setup>
const myInput = ref(null)
myInput.value.focus()  // funciona porque foi exposto
</script>
```

Use com parcimônia — geralmente é melhor design controlar via props/events.
</details>
