# Passo a passo — criando este projeto do zero

Como sair de **nada** até este app de login rodando, começando pelo comando que
cria o Vue. Cada passo tem o comando e o arquivo que você mexe.

> 📌 Aqui usamos o caminho **oficial** (`npm create vue@latest`). No fim tem a
> alternativa mínima (Vite puro), que é como este projeto foi de fato montado.

---

## Passo 0 — Pré-requisitos

```bash
node -v    # precisa ser 20 ou maior
npm -v
```

Se não tiver Node, instale a versão LTS em <https://nodejs.org>. Veja
[FERRAMENTAS.md](../../00-do-dom-ao-vue/FERRAMENTAS.md) para entender cada ferramenta.

---

## Passo 1 — Criar o projeto (o comando do Vue)

```bash
npm create vue@latest projeto-vite-login
```

Um assistente faz algumas perguntas. Para este projeto, responda:

| Pergunta do assistente | Resposta | Por quê |
|------------------------|----------|---------|
| Add TypeScript? | **No** | nível 1 é em JS puro |
| Add JSX Support? | **No** | usamos template `.vue` |
| **Add Vue Router** for SPA? | **Yes** ✅ | é o que dá as **rotas/páginas** |
| Add Pinia? | **No** | nosso estado cabe num composable |
| Add Vitest / E2E? | **No** | testes entram no nível 4 |
| Add ESLint / Prettier? | **No** (opcional) | pode dizer Yes, não atrapalha |

> As perguntas mudam um pouco conforme a versão do `create-vue`. A que importa
> aqui é **Vue Router → Yes**. (Tabela completa em
> [FERRAMENTAS.md](../../00-do-dom-ao-vue/FERRAMENTAS.md#criando-um-projeto-o-jeito-oficial).)

---

## Passo 2 — Instalar e rodar

```bash
cd projeto-vite-login
npm install      # baixa as dependências (cria node_modules/) — só na 1ª vez
npm run dev      # sobe em http://localhost:5173
```

Abra o navegador: já aparece a tela de exemplo do Vue. A partir daqui é só
**adaptar**.

---

## Passo 3 — Limpar o que veio de exemplo

Com Router=Yes, o `create vue` cria arquivos de demonstração. Apague/zere:

```
src/components/   → apague HelloWorld.vue, TheWelcome.vue, WelcomeItem.vue, icons/
src/views/        → apague HomeView.vue e AboutView.vue (vamos criar as nossas)
src/assets/       → pode esvaziar base.css/logo.svg; mantemos só um main.css
```

Sobra o esqueleto: `index.html`, `main.js`, `App.vue`, `router/index.js`.

---

## Passo 4 — Criar a camada de dados (`services/`)

O "mundo externo", isolado da interface. Dois arquivos:

- [src/services/auth.js](src/services/auth.js) — o **backend FALSO**: a lista de
  usuários mockados e a função `login()` que devolve uma `Promise` (igual a um
  `fetch`).
- [src/services/storage.js](src/services/storage.js) — salva/lê a **sessão** no
  `localStorage`.

> Por que separar? Se um dia trocar o mock por uma API real, só estes 2 arquivos mudam.

---

## Passo 5 — Criar o cérebro (`composables/useAuth.js`)

[src/composables/useAuth.js](src/composables/useAuth.js) — guarda o estado da
sessão (`usuario`) e expõe `logar()` / `sair()` / `isAutenticado`.

⚠️ Detalhe-chave: o `ref(usuario)` fica **fora** da função `useAuth()` — assim a
sessão é **uma só** para o app inteiro (cabeçalho, guard e views veem a mesma).

---

## Passo 6 — Criar o componente de formulário (`components/`)

[src/components/LoginForm.vue](src/components/LoginForm.vue) — só o formulário e a
**validação**. Ele não sabe o que é login: recebe `carregando`/`erro` por `props`
e **emite** o evento `enviar` com `{ email, senha }`.

---

## Passo 7 — Criar as páginas (`views/`)

- [src/views/LoginView.vue](src/views/LoginView.vue) — rota `/login`. Junta o
  `LoginForm` + `useAuth` e, ao logar, navega para o painel.
- [src/views/PainelView.vue](src/views/PainelView.vue) — rota `/`, **protegida**:
  mostra os dados do usuário logado.

---

## Passo 8 — Configurar rotas + proteção (`router/index.js`)

Em [src/router/index.js](src/router/index.js):

1. Mapeie as rotas: `/login` → `LoginView`, `/` → `PainelView` (com
   `meta: { requerAuth: true }`).
2. Adicione o **guard** `router.beforeEach`: quem não está logado e tenta abrir
   uma rota protegida é redirecionado para `/login`.

---

## Passo 9 — Ajustar o esqueleto

- [src/App.vue](src/App.vue) — cabeçalho com o nome do usuário + botão **Sair**, e
  o `<RouterView />` onde as páginas entram.
- [src/main.js](src/main.js) — confirme `createApp(App).use(router).mount('#app')`
  (o `.use(router)` já vem do scaffold).
- [src/assets/main.css](src/assets/main.css) — estilos globais.

---

## Passo 10 — Testar o fluxo

`npm run dev` e:

1. Entre com `admin@vue.com` / `123456` → cai no **painel**.
2. Dê **F5** → continua logado (graças ao `localStorage`).
3. Clique em **Sair** e tente abrir `/` → o **guard** te manda pro login.

---

## Resumo visual

```
npm create vue@latest   →  scaffold (Router=Yes)
        │
   limpar exemplos
        │
 services/  →  composables/  →  components/  →  views/  →  router/ (guard)
 (dados)       (estado)          (UI)            (telas)     (navegação)
```

---

## Alternativa: o caminho mínimo (sem `create vue`)

Foi assim que este projeto específico nasceu — só Vite + Vue + Router, sem
ESLint/Vitest:

```bash
npm create vite@latest projeto-vite-login -- --template vue
cd projeto-vite-login
npm install
npm install vue-router@4      # o Router NÃO vem no template do Vite puro
```

Depois você cria as pastas `services/`, `composables/`, `views/`, `components/` e
`router/` na mão (passos 4 a 9) e adiciona o alias `@` no
[vite.config.js](vite.config.js).

| | `npm create vue@latest` | `npm create vite -- --template vue` |
|---|---|---|
| Router já incluso? | sim (se responder Yes) | **não** (instala à mão) |
| Vem com exemplos? | sim (precisa limpar) | quase nada |
| Recomendado para | projetos Vue de verdade | quando quer o mínimo / entender cada peça |
