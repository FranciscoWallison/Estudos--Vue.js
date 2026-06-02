<script setup>
// COMPONENTE reutilizável: mostra UMA tarefa.
// Recebe a tarefa via props e avisa o pai (eventos) quando o usuário
// marca como feita ou remove. Fluxo clássico: props descem, eventos sobem.

// defineProps declara o que o componente RECEBE do pai.
defineProps({
  tarefa: { type: Object, required: true },
})

// eventos que ele EMITE para o pai
const emit = defineEmits(['alternar', 'remover'])
</script>

<template>
  <li class="item" :class="{ feita: tarefa.feita }">
    <input
      type="checkbox"
      :checked="tarefa.feita"
      @change="emit('alternar', tarefa.id)"
    />
    <span>{{ tarefa.texto }}</span>
    <button class="remover" @click="emit('remover', tarefa.id)">✕</button>
  </li>
</template>

<style scoped>
.item { display: flex; align-items: center; gap: 8px; padding: 8px; border-bottom: 1px solid #eee; }
.item span { flex: 1; }
.item.feita span { text-decoration: line-through; color: var(--cinza); }
.remover { color: #c00; border-color: #f0caca; }
</style>
