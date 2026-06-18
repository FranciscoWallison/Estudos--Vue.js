# projeto-vite-login

A mesma tela de login do [vue3-cdn.html](../vue3-cdn.html), agora como um
**projeto Vite real**, organizado em rotas, páginas, componentes e serviços —
com autenticação **mockada no `localStorage`** para você testar sem backend.

> 🧭 Quer recriar este projeto do zero, **desde o comando que cria o Vue**? Siga o
> [PASSO-A-PASSO.md](PASSO-A-PASSO.md).

## Como rodar

```bash
cd projeto-vite-login
npm install     # instala dependências (só na 1ª vez)
npm run dev     # sobe em http://localhost:5173
```

> Precisa de **Node 20+**.

## Credenciais de teste (mockadas)

| E-mail | Senha |
|--------|-------|
| `admin@vue.com` | `123456` |
| `maria@vue.com` | `senha123` |

Definidas em [src/services/auth.js](src/services/auth.js). Qualquer outra
combinação cai no erro "E-mail ou senha inválidos".

## Estrutura

```
projeto-vite-login/
├── index.html
├── package.json
├── vite.config.js            # alias "@" → ./src
└── src/
    ├── main.js               # createApp(App).use(router).mount('#app')
    ├── App.vue               # layout: cabeçalho (usuário + Sair) + <RouterView/>
    ├── assets/main.css       # css global
    ├── router/index.js       # rotas + GUARD de autenticação
    ├── views/
    │   ├── LoginView.vue      # rota /login  — orquestra form + auth
    │   └── PainelView.vue     # rota /        — protegida (só logado)
    ├── components/
    │   └── LoginForm.vue      # formulário + validação (props descem, evento sobe)
    ├── composables/
    │   └── useAuth.js         # "cérebro" da sessão (estado COMPARTILHADO)
    └── services/
        ├── auth.js           # backend FALSO: usuários mockados + login()
        └── storage.js        # sessão no localStorage (trocável por API/cookie)
```

## Fluxo de dados (quem chama quem)

```
LoginView (view)
   │  usa
   ▼
useAuth() (composable)  ──►  auth.js (service, mock)   ──► "valida usuário"
   │                    └─►  storage.js (service)       ──► localStorage (sessão)
   ▼
LoginForm (component)
   props descem ▼     ▲ evento 'enviar' sobe
```

**Princípio:** a UI (`views`/`components`) nunca fala com `localStorage` nem com a
"API" direto — passa pelo `composable`, que passa pelos `services`. Trocar o mock
por uma API REST de verdade = mexer **só** em `services/auth.js` e `storage.js`.

## Os 4 conceitos novos aqui (vs. o vue3-cdn.html)

1. **Rotas** (`router/index.js`) — duas páginas: `/login` e `/` (painel).
2. **Guard de autenticação** — `router.beforeEach` redireciona quem não está
   logado para `/login`, e quem já está logado para fora do `/login`.
3. **Estado compartilhado** — em `useAuth.js` o `ref(usuario)` fica **fora** da
   função (singleton): cabeçalho, guard e views enxergam a mesma sessão. Compare
   com `useTarefas.js` do projeto-todo, onde o estado é criado **dentro**.
4. **Persistência** — `localStorage` faz a sessão sobreviver ao `F5`.

## "Devo usar storage?"

Para um login, **sim** — é o que faz o app "lembrar" que você está logado depois
de recarregar a página. Sem storage, todo reload volta pro login.

| Onde guardar | Dura quanto | Quando usar |
|--------------|-------------|-------------|
| `localStorage` | até limpar (sobrevive a fechar o navegador) | "manter conectado" |
| `sessionStorage` | até fechar a aba | sessão curta |
| só memória (`ref`) | até o reload | dados não-críticos |

> ⚠️ **Produção:** o `localStorage` é legível por qualquer JS da página (risco de
> XSS). Não guarde senha; no máximo um token — e o mais seguro é o servidor mandar
> um **cookie `httpOnly`**. Aqui é um mock didático.

## O que praticar

1. Adicione uma rota `/registro` com um `RegistroView.vue` que insere um usuário
   novo no array de `auth.js`.
2. Faça o botão **Sair** pedir confirmação antes de encerrar a sessão.
3. Troque o `localStorage` por `sessionStorage` em `services/storage.js` e veja a
   sessão sumir ao fechar a aba — **sem tocar em mais nenhum arquivo**.
