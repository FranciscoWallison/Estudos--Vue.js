# Nível 1 — Perguntas e Respostas

---

### 1. Qual a diferença entre `ref` e `reactive`?

<details>
<summary>Resposta</summary>

- `ref(value)` → envelopa **qualquer valor** (primitivo ou objeto) em um objeto `{ value }`. Use sempre que possível.
- `reactive(obj)` → torna um **objeto** reativo diretamente, sem `.value`. Não funciona com primitivos.

```js
const count = ref(0)        // count.value
const user = reactive({ name: 'Ana' })  // user.name
```

Na prática, prefira `ref` — uniformiza o código e funciona com qualquer tipo.
</details>

---

### 2. Por que `reactive` perde reatividade ao destruturar?

<details>
<summary>Resposta</summary>

`reactive` usa um Proxy. Ao destruturar, você copia o valor primitivo para fora do Proxy, perdendo o vínculo.

```js
const state = reactive({ count: 0 })
const { count } = state     // NÃO reativo
state.count++               // count local não muda

// Solução: toRefs
const { count } = toRefs(state)
state.count++               // count.value muda
```
</details>

---

### 3. Quando usar `computed` vs `watch`?

<details>
<summary>Resposta</summary>

- **`computed`**: para **derivar** um valor a partir de outros. Cacheado. Síncrono.
- **`watch`**: para reagir a uma mudança com um **efeito colateral** (chamar API, salvar no storage, etc).

```js
const total = computed(() => price.value * qty.value)  // derivar

watch(searchTerm, (newTerm) => {
  fetchResults(newTerm)  // efeito colateral
})
```

Regra: se você só precisa exibir, use `computed`. Se precisa fazer algo, use `watch`.
</details>

---

### 4. Por que `:key` é obrigatório em `v-for`?

<details>
<summary>Resposta</summary>

Vue usa `key` para identificar qual item mudou, foi adicionado ou removido. Sem `key`, ele reaproveita elementos do DOM por posição, o que causa bugs em listas com estado interno (inputs, animações).

```vue
<!-- RUIM -->
<li v-for="(u, i) in users" :key="i">

<!-- BOM -->
<li v-for="u in users" :key="u.id">
```

Use `index` só se a lista for **estática** (nunca muda de ordem nem é filtrada).
</details>

---

### 5. `v-if` ou `v-show`?

<details>
<summary>Resposta</summary>

- `v-if`: **remove e recria** o elemento no DOM. Mais custoso, mas economiza memória quando o elemento raramente aparece.
- `v-show`: alterna `display: none`. Mais barato para alternar, mas mantém no DOM.

**Use `v-show`** quando você alterna com frequência (tabs, dropdowns). **Use `v-if`** para conteúdo condicional raro (modal, error state).
</details>

---

### 6. O que acontece se eu mutar uma `prop` diretamente?

<details>
<summary>Resposta</summary>

Vue **avisa no console** (em modo dev) e o valor pode ser sobrescrito na próxima renderização do pai. Props são **fluxo unidirecional** (top-down).

```js
// Filho — ERRADO
props.title = 'Novo'

// Filho — CERTO
emit('update:title', 'Novo')   // pai escuta e atualiza
```

Esse é o padrão por trás do `v-model` em componentes.
</details>

---

### 7. Diferença entre `@click="foo"` e `@click="foo()"` ?

<details>
<summary>Resposta</summary>

- `@click="foo"` — passa a referência da função. Vue chama com o evento.
- `@click="foo()"` — **invoca imediatamente** na renderização e usa o retorno. Geralmente é um bug.
- `@click="foo($event, 'extra')"` — chamada explícita passando argumentos.

```vue
<button @click="handleClick">OK</button>             <!-- ✔ -->
<button @click="handleClick()">OK</button>           <!-- ✔ se quer chamar sem args -->
<button @click="handleClick(item, $event)">OK</button> <!-- ✔ com args -->
```
</details>

---

### 8. Como acessar o DOM de um elemento?

<details>
<summary>Resposta</summary>

Crie um `ref` com o mesmo nome do atributo `ref="..."` no template. Disponível só após `onMounted`.

```vue
<script setup>
import { ref, onMounted } from 'vue'
const inputEl = ref(null)
onMounted(() => inputEl.value.focus())
</script>

<template>
  <input ref="inputEl" />
</template>
```
</details>

---

### 9. Por que o lifecycle `onMounted` em vez de fazer no topo do `<script setup>`?

<details>
<summary>Resposta</summary>

No topo do `<script setup>` o DOM **ainda não existe**. Código nesse momento é como o `setup()` da Options API — só estado e funções.

`onMounted` garante que o `<template>` foi renderizado, então você pode:
- Acessar refs de elementos.
- Inicializar libs que precisam de DOM (Chart.js, mapas).
- Chamar APIs (também é OK, mas pode ser feito direto no setup).
</details>

---

### 10. Como limpar um `setInterval` corretamente?

<details>
<summary>Resposta</summary>

Sempre em `onUnmounted` — senão o timer continua rodando e gera memory leak.

```js
import { onMounted, onUnmounted } from 'vue'

let timer
onMounted(() => {
  timer = setInterval(() => console.log('tick'), 1000)
})
onUnmounted(() => clearInterval(timer))
```

Mesma lógica vale para `addEventListener`, `WebSocket`, observers, etc.
</details>

---

### 11. O que faz `<script setup>` que o `<script>` normal não faz?

<details>
<summary>Resposta</summary>

`<script setup>` é açúcar sintático para o `setup()` da Composition API:

- Tudo no topo do script já é exposto ao template (sem `return { }`).
- Componentes importados são auto-registrados.
- Macros: `defineProps`, `defineEmits`, `defineExpose`, `defineModel`.
- Mais performático (compila para código otimizado).

Use **sempre** em projetos novos.
</details>

---

### 12. O que é `v-model` por trás dos panos?

<details>
<summary>Resposta</summary>

Açúcar sintático para `:value` + `@input`:

```vue
<input v-model="name" />

<!-- equivale a -->
<input :value="name" @input="name = $event.target.value" />
```

Em componentes customizados, o nome do prop default é `modelValue` e o evento é `update:modelValue`.
</details>
