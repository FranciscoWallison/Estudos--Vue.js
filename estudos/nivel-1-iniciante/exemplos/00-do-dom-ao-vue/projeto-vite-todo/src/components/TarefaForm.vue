<script setup>
// COMPONENTE "burro" e reutilizável: só coleta o texto e AVISA o pai.
// Ele não sabe o que é uma tarefa nem onde ela é salva — só emite o evento.
import { ref } from 'vue'

// defineEmits declara os eventos que este componente dispara para o pai.
const emit = defineEmits(['adicionar'])

const texto = ref('')

function enviar() {
  if (!texto.value.trim()) return
  emit('adicionar', texto.value) // entrega o texto ao pai
  texto.value = ''               // limpa o campo
}
</script>

<template>
  <form class="form" @submit.prevent="enviar">
    <input v-model="texto" placeholder="Nova tarefa..." autocomplete="off" />
    <button type="submit">Adicionar</button>
  </form>
</template>

<style scoped>
.form { display: flex; gap: 8px; margin-bottom: 16px; }
input { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
</style>
