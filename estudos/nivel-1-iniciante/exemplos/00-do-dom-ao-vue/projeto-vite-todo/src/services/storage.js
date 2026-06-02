// ────────────────────────────────────────────────────────────────
//  SERVICE — fala com o "mundo externo". Aqui é o localStorage,
//  mas poderia ser uma API HTTP (axios/fetch). A UI NÃO conhece
//  esse detalhe: ela só chama carregar()/salvar().
//
//  Isolar isso aqui significa que, se um dia trocarmos localStorage
//  por uma API, só ESTE arquivo muda.
// ────────────────────────────────────────────────────────────────
const CHAVE = 'todo-vue:tarefas'

export function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? []
  } catch {
    return []
  }
}

export function salvar(tarefas) {
  localStorage.setItem(CHAVE, JSON.stringify(tarefas))
}
