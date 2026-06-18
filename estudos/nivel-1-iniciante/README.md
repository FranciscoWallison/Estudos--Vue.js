# Nível 1 — Iniciante (Fundamentos do Vue 3)

Primeiro contato com Vue. Foco em reatividade e diretivas básicas usando **Composition API + `<script setup>`**.

## Objetivos

- Criar e rodar um projeto Vue 3 com Vite.
- Entender a diferença entre `ref` e `reactive`.
- Usar diretivas de template (`v-if`, `v-for`, `v-model`, `v-on`, `v-bind`).
- Lidar com lifecycle hooks (`onMounted`, `onUnmounted`).
- Compor uma SPA simples com múltiplos componentes.

## Setup inicial

```bash
npm create vue@latest meu-projeto
cd meu-projeto
npm install
npm run dev
```

Quando perguntar, responda **No** para tudo (TypeScript, Router, Pinia, etc) neste nível. Vamos adicionar depois.

## Estrutura mínima de um SFC

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)

function increment() {
  count.value++
}

onMounted(() => {
  console.log('Componente montado')
})
</script>

<template>
  <button @click="increment">{{ count }} (x2 = {{ doubled }})</button>
</template>

<style scoped>
button { padding: 8px 16px; }
</style>
```

## Tópicos essenciais

### Reatividade
- `ref(value)` → cria valor reativo. Acesso via `.value` no JS, sem `.value` no template.
- `reactive(obj)` → cria objeto reativo. Acesso direto às propriedades.
- `computed(() => ...)` → valor derivado, cacheado, recalculado quando dependências mudam.
- `watch(source, cb)` → reage a mudanças. Versão `watchEffect` acompanha tudo que é referenciado.

### Diretivas built-in
- `v-bind:attr` ou `:attr` — vincular atributo.
- `v-on:event` ou `@event` — escutar evento.
- `v-model` — two-way binding em inputs.
- `v-if` / `v-else-if` / `v-else` — renderização condicional (remove do DOM).
- `v-show` — alterna `display: none` (mantém no DOM).
- `v-for="item in items" :key="item.id"` — sempre use `:key` único.
- `v-html` — renderiza HTML cru (cuidado com XSS).

### Modificadores
- `@click.stop` — `event.stopPropagation()`.
- `@click.prevent` — `event.preventDefault()`.
- `@click.once` — dispara só uma vez.
- `@keydown.enter` — só quando tecla Enter.
- `v-model.lazy` — atualiza no `change`, não no `input`.
- `v-model.number` — converte para número.
- `v-model.trim` — remove espaços.

### Lifecycle (Composition API)
- `onBeforeMount` → antes de renderizar.
- `onMounted` → DOM disponível, pode acessar `ref` de elementos.
- `onBeforeUpdate` / `onUpdated` → mudanças reativas.
- `onBeforeUnmount` / `onUnmounted` → limpeza (timers, listeners).

## Erros comuns

- **Esquecer o `.value`** em refs no script.
- **Não usar `:key`** em `v-for` → bugs de renderização.
- **Destructurar `reactive()`** → perde reatividade. Use `toRefs()` se precisar.
- **Mutar prop diretamente** → emita evento para o pai.

## Exemplos resolvidos

- [00 — Do DOM ao Vue](exemplos/00-do-dom-ao-vue/) — **comece por aqui.** A trilha completa: manipular o DOM na mão → Vue → `createApp` → [arquitetura de pastas](exemplos/00-do-dom-ao-vue/ARQUITETURA.md) → [ferramentas](exemplos/00-do-dom-ao-vue/FERRAMENTAS.md), com um [projeto Vite real](exemplos/00-do-dom-ao-vue/projeto-vite-todo/) no fim.
- [01 — Reatividade e Virtual DOM](exemplos/01-reatividade/) — o mesmo contador em JS puro vs Vue 3, lado a lado e explicado.
- [02 — Carrinho de compras](exemplos/02-carrinho-de-compras/) — um mini carrinho em JS puro vs Vue 3, e a ponte entre **Options API** e Composition API.
- [03 — Tela de login](exemplos/03-tela-de-login/) — **formulários em Vue 3**: `v-model`, validação com `computed`, `@submit.prevent` e estados de tela com `v-if`.

## Próximos passos

Faça os [desafios](desafios.md) na ordem, e revise o [Q&A](perguntas-respostas.md). Depois vá para [nível 2](../nivel-2-componentes/).
