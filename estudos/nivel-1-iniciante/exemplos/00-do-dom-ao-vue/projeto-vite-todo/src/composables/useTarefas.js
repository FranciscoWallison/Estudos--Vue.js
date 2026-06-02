// ────────────────────────────────────────────────────────────────
//  COMPOSABLE — lógica reativa reutilizável, SEM interface.
//  É o "cérebro" da feature de tarefas: guarda o estado, expõe ações
//  e cuida da persistência. Qualquer componente pode usar com useTarefas().
//
//  Convenção: nome começa com "use" (igual aos hooks).
// ────────────────────────────────────────────────────────────────
import { ref, computed, watch } from 'vue'
import { carregar, salvar } from '@/services/storage'

export function useTarefas() {
  // estado reativo, já hidratado a partir do service
  const tarefas = ref(carregar())
  let proximoId = Math.max(0, ...tarefas.value.map((t) => t.id)) + 1

  // valores derivados (recalculam sozinhos)
  const total = computed(() => tarefas.value.length)
  const concluidas = computed(() => tarefas.value.filter((t) => t.feita).length)

  // persiste automaticamente sempre que a lista muda (deep watch)
  watch(tarefas, (novo) => salvar(novo), { deep: true })

  // ── ações ──
  function adicionar(texto) {
    const limpo = texto.trim()
    if (!limpo) return
    tarefas.value.push({ id: proximoId++, texto: limpo, feita: false })
  }

  function remover(id) {
    tarefas.value = tarefas.value.filter((t) => t.id !== id)
  }

  function alternar(id) {
    const t = tarefas.value.find((t) => t.id === id)
    if (t) t.feita = !t.feita
  }

  // expõe estado + ações para quem chamar
  return { tarefas, total, concluidas, adicionar, remover, alternar }
}
