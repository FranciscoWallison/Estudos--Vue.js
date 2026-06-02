<script setup>
// VIEW = tela inteira ligada a uma rota ("/").
// Ela ORQUESTRA: pega a lógica do composable e monta a UI com os componentes.
import { useTarefas } from '@/composables/useTarefas'
import TarefaForm from '@/components/TarefaForm.vue'
import TarefaItem from '@/components/TarefaItem.vue'

// toda a lógica/estado vem do composable — a view fica enxuta
const { tarefas, total, concluidas, adicionar, remover, alternar } = useTarefas()
</script>

<template>
  <!-- o form emite 'adicionar' → chamamos a ação do composable -->
  <TarefaForm @adicionar="adicionar" />

  <ul v-if="tarefas.length" class="lista">
    <!-- props descem (:tarefa), eventos sobem (@alternar/@remover) -->
    <TarefaItem
      v-for="t in tarefas"
      :key="t.id"
      :tarefa="t"
      @alternar="alternar"
      @remover="remover"
    />
  </ul>

  <!-- v-else: estado vazio -->
  <p v-else class="vazio">Nenhuma tarefa ainda. Adicione a primeira! 👆</p>

  <p class="resumo">{{ concluidas }} de {{ total }} concluída(s)</p>
</template>

<style scoped>
.lista { list-style: none; padding: 0; }
.vazio { color: var(--cinza); text-align: center; padding: 24px 0; }
.resumo { margin-top: 12px; font-size: 0.9rem; color: var(--cinza); }
</style>
