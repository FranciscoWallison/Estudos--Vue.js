// ────────────────────────────────────────────────────────────────
//  SERVICE de autenticação — o "backend FALSO".
//  Aqui mora a lista de usuários MOCKADA (para teste). Num app real,
//  esta função faria um fetch('/api/login') para um servidor.
//
//  A UI não conhece este detalhe: ela só chama login() e recebe uma
//  Promise. Trocar o mock por uma API de verdade = mexer SÓ neste arquivo.
// ────────────────────────────────────────────────────────────────

// 🔑 Credenciais de teste (mockadas). Em produção isto NUNCA fica no front.
const USUARIOS = [
  { id: 1, nome: 'Admin', email: 'admin@vue.com', senha: '123456' },
  { id: 2, nome: 'Maria', email: 'maria@vue.com', senha: 'senha123' },
]

/**
 * Simula um POST /login. Devolve uma Promise, exatamente como um fetch().
 * Resolve com { token, usuario } se as credenciais batem; senão, rejeita.
 */
export function login(email, senha) {
  return new Promise((resolve, reject) => {
    // setTimeout finge a latência da rede (400ms) para você ver o estado "Entrando…".
    setTimeout(() => {
      const encontrado = USUARIOS.find(
        (u) => u.email === email && u.senha === senha,
      )

      if (!encontrado) {
        reject(new Error('E-mail ou senha inválidos.'))
        return
      }

      // Nunca devolva a senha para a interface. Removemos antes de responder
      // e geramos um "token" fake (o que um JWT real representaria).
      const { senha: _omitida, ...usuario } = encontrado
      resolve({ token: `fake-jwt-token-${usuario.id}`, usuario })
    }, 400)
  })
}
