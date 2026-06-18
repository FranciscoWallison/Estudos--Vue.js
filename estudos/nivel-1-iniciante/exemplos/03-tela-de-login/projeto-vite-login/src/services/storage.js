// ────────────────────────────────────────────────────────────────
//  SERVICE de armazenamento — onde a SESSÃO é guardada.
//
//  "Devo usar storage?" → Para LEMBRAR que o usuário está logado entre
//  reloads/abas, sim. Sem isto, todo F5 jogaria o usuário de volta pro
//  login (o estado em memória se perde ao recarregar a página).
//
//  Opções e quando usar:
//    • localStorage   → persiste até limpar manualmente (mesmo fechando o
//                       navegador). Bom para "manter conectado".
//    • sessionStorage → some quando a aba é fechada. Bom para sessão curta.
//    • só memória     → some no reload. Mais seguro, menos cômodo.
//
//  ⚠️ Em produção, NÃO guarde dados sensíveis aqui (qualquer JS da página
//  lê o localStorage). Guarde no máximo um token; o ideal é cookie httpOnly.
//  Aqui é só um MOCK para estudo.
// ────────────────────────────────────────────────────────────────
const CHAVE = 'login-vue:sessao'

export function carregarSessao() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) ?? null
  } catch {
    return null
  }
}

export function salvarSessao(usuario) {
  localStorage.setItem(CHAVE, JSON.stringify(usuario))
}

export function limparSessao() {
  localStorage.removeItem(CHAVE)
}
