# Nível 2 — Componentes em profundidade

Comunicação pai-filho, composição via slots, e extração de lógica reutilizável.

## Objetivos

- Tipar e validar props.
- Emitir e escutar eventos customizados.
- Construir componentes flexíveis com slots.
- Criar e usar **composables** (composition functions).
- Compreender `provide`/`inject` e quando usar.

## Tópicos essenciais

### Props
```vue
<script setup>
// JS — validação simples
const props = defineProps({
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  tags:  { type: Array, default: () => [] }
})
</script>
```

Regras:
- **Sempre validar** props (`type`, `required`, `default`, `validator`).
- Para `Array`/`Object`, `default` deve ser uma **função** (senão é compartilhado entre instâncias).
- **Nunca mute** uma prop direto — emita evento.

### Emits
```vue
<script setup>
const emit = defineEmits(['select', 'delete'])

function handleClick() {
  emit('select', { id: 1 })
}
</script>
```

Com validação:
```js
const emit = defineEmits({
  select: (payload) => payload && typeof payload.id === 'number'
})
```

### v-model em componentes
```vue
<!-- Pai -->
<MyInput v-model="text" />

<!-- Filho (MyInput.vue) -->
<script setup>
const model = defineModel()  // Vue 3.4+
</script>
<template>
  <input v-model="model" />
</template>
```

Múltiplos v-models:
```vue
<UserForm v-model:name="userName" v-model:age="userAge" />
```

### Slots

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <header><slot name="header">Título padrão</slot></header>
    <main><slot /></main>
    <footer><slot name="footer" /></footer>
  </div>
</template>

<!-- Uso -->
<Card>
  <template #header>Bem-vindo</template>
  Conteúdo principal
  <template #footer>
    <button>OK</button>
  </template>
</Card>
```

**Scoped slots** — filho expõe dados para o slot do pai:
```vue
<!-- DataList.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :selected="isSelected(item)" />
    </li>
  </ul>
</template>

<!-- Uso -->
<DataList :items="users">
  <template #default="{ item, selected }">
    {{ item.name }} <span v-if="selected">✓</span>
  </template>
</DataList>
```

### Provide / Inject

Para passar dados a descendentes muito profundos sem prop drilling.

```js
// Ancestral
import { provide, ref } from 'vue'
const theme = ref('dark')
provide('theme', theme)

// Descendente (qualquer nível)
import { inject } from 'vue'
const theme = inject('theme', 'light')  // 'light' = default
```

Use com moderação — torna o fluxo de dados implícito. Para estado global, prefira **Pinia** (nível 3).

### Composables

Função que reutiliza lógica reativa. Convencionalmente começa com `use`.

```js
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const doubled = computed(() => count.value * 2)
  function increment() { count.value++ }
  function reset() { count.value = initial }
  return { count, doubled, increment, reset }
}
```

Uso:
```vue
<script setup>
import { useCounter } from '@/composables/useCounter'
const { count, doubled, increment } = useCounter(10)
</script>
```

### Componentes especiais

- `<Transition>` — animações de entrada/saída.
- `<TransitionGroup>` — listas animadas.
- `<KeepAlive>` — preserva estado de componentes desmontados.
- `<Teleport to="body">` — renderiza fora da hierarquia (modais).
- `<Suspense>` — UI com componentes async.

## Próximos passos

[Desafios](desafios.md) → [Q&A](perguntas-respostas.md) → [nível 3](../nivel-3-ecossistema/).
