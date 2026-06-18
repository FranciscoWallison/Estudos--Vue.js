// ────────────────────────────────────────────────────────────────
//  COMPOSABLE de autenticação — o "cérebro" da sessão.
//
//  DIFERENÇA IMPORTANTE para o useTarefas() do projeto-todo:
//  aqui o estado `usuario` é declarado FORA da função. Por quê?
//  Porque a sessão é UMA SÓ para o app inteiro — o cabeçalho (App.vue),
//  o guard de rota e as views precisam enxergar o MESMO usuário.
//  Se criássemos o ref dentro da função, cada componente teria a sua
//  própria cópia (estado isolado), e logar numa tela não refletiria na outra.
//
//  Estado fora da função = singleton compartilhado.
//  Estado dentro da função = uma instância nova por chamada.
// ────────────────────────────────────────────────────────────────
import { ref, computed } from 'vue'
import { login as loginApi } from '@/services/auth'
import { carregarSessao, salvarSessao, limparSessao } from '@/services/storage'

// Hidrata do storage no carregamento: se já havia sessão salva, começa logado.
const usuario = ref(carregarSessao())

export function useAuth() {
  const isAutenticado = computed(() => usuario.value !== null)

  async function logar(email, senha) {
    // chama o "backend" mockado; se as credenciais não baterem, ele lança erro
    const { usuario: logado } = await loginApi(email, senha)
    usuario.value = logado     // atualiza o estado reativo (a UI reage)
    salvarSessao(logado)       // persiste para sobreviver ao reload
    return logado
  }

  function sair() {
    usuario.value = null
    limparSessao()
  }

  return { usuario, isAutenticado, logar, sair }
}
