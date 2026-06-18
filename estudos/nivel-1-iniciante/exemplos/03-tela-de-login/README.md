# Exemplo 03 — Tela de login (Vue 3)

> Primeiro contato com **formulários** no Vue. Diferente dos exemplos 01 e 02, aqui
> **não** há versão "JS puro" para comparar: o foco é aprender o jeito Vue 3 de lidar
> com inputs, validação e estados de tela.

## O problema

Um formulário de login com **e-mail** e **senha**. Ele precisa:

- guardar o que o usuário digita (sem `querySelector`/`.value` na mão);
- **validar** em tempo real e só liberar o botão **Entrar** quando estiver tudo certo;
- mostrar/ocultar a senha;
- simular o envio (estado "Entrando…") e trocar para uma tela de boas-vindas.

> **Regra de ouro do Vue:** você muda o **dado**, não a tela. O formulário inteiro é só
> um reflexo de algumas variáveis (`email`, `senha`, `logado`…).

## Arquivos

| Arquivo | O que é | Como rodar |
|--------|---------|-----------|
| [vue3-cdn.html](vue3-cdn.html) | Login num **único arquivo** (Composition API via CDN) — aprenda os conceitos aqui | duplo-clique abre no navegador |
| [projeto-vite-login/](projeto-vite-login/) | O **mesmo login como projeto real**: rotas, páginas, componentes e auth mockada no `localStorage` | `npm install && npm run dev` |

Comece pelo `vue3-cdn.html` (não precisa instalar nada). Quando os conceitos de
formulário fizerem sentido, abra o [projeto-vite-login/](projeto-vite-login/) para ver
como isso vira um app **organizado em pastas** — com rotas, página protegida e um
"backend" falso. Lá também respondemos **"devo usar storage?"**.

---

## 1. `v-model` — o coração de todo formulário

`v-model` faz a ligação **nos dois sentidos** entre o input e a variável:

```html
<input v-model="email" type="email">
```

```js
const email = ref('')
```

- Usuário digita → `email` muda.
- Código muda `email` → o campo muda.

É o que substitui o `input.value` + `addEventListener('input', ...)` do JS puro. Funciona
em `text`, `email`, `password`, `checkbox` (vira `true/false`), `radio`, `select` e
`textarea`.

> Variações úteis: `v-model.trim` (remove espaços), `v-model.number` (converte para número),
> `v-model.lazy` (atualiza no `change`, não a cada tecla).

## 2. Validação com `computed`

Em vez de escrever uma função `validar()` e chamá-la em todo lugar, você **declara** o que
é "válido" e o Vue recalcula sozinho a cada tecla:

```js
const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const senhaValida = computed(() => senha.value.length >= 6)
const formValido  = computed(() => emailValido.value && senhaValida.value)
```

> ⚠️ A regex aqui é só didática. Validação séria de e-mail é melhor no backend.

## 3. `@submit.prevent` — enviar sem recarregar a página

```html
<form @submit.prevent="entrar">
```

O modificador `.prevent` já faz o `event.preventDefault()` por você — sem ele, o navegador
recarregaria a página ao enviar o formulário.

## 4. `:disabled` e `:class` — atributos reativos

`v-bind` (o `:`) liga **qualquer atributo** a um dado:

```html
<button :disabled="!formValido || enviando">Entrar</button>
<input  :class="{ 'is-invalid': tentouEnviar && !emailValido }">
<input  :type="mostrarSenha ? 'text' : 'password'">
```

- `:disabled` → botão só habilita quando o form é válido (sem `if` na mão).
- `:class="{ classe: condicao }"` → adiciona a classe só quando a condição é verdadeira.
- `:type` → o mesmo input vira `text` ou `password` conforme um botão "Mostrar/Ocultar".

## 5. `v-if` / `v-else` — trocar a tela conforme o estado

```html
<form v-if="!logado"> … </form>
<div  v-else> Bem-vindo, {{ email }} </div>
```

Uma variável (`logado`) decide qual bloco aparece. O mesmo vale para o texto do botão
(`Entrar` ↔ `Entrando…`) durante o envio simulado.

---

## Diretivas usadas neste exemplo

| Diretiva | Para que serve aqui |
|----------|---------------------|
| `v-model` | ligar e-mail, senha e checkbox "lembrar-me" |
| `@submit.prevent` | enviar o form sem recarregar a página |
| `@click` | mostrar/ocultar senha, sair |
| `:disabled` | travar o botão enquanto o form é inválido / enviando |
| `:class` | pintar o campo de vermelho quando inválido |
| `:type` | alternar senha entre oculta e visível |
| `v-if` / `v-else` | trocar entre formulário e tela de boas-vindas |
| `{{ }}` | mostrar o e-mail logado e o texto do botão |

---

## Experimentos para fixar

1. **Fácil:** mude a regra da senha para no mínimo 8 caracteres e veja o botão **Entrar**
   reagir sozinho.
2. **Médio:** adicione um contador `{{ senha.length }}/6` abaixo do campo de senha.
3. **Médio:** mostre uma mensagem de erro "E-mail ou senha incorretos" quando o e-mail for
   diferente de um valor fixo (ex.: `admin@vue.com`) — crie um `ref` `erro` e um `v-if`.
4. **Avançado:** desabilite o botão também enquanto o e-mail estiver **vazio**, mas só
   mostre o erro depois do primeiro envio (já é o papel do `tentouEnviar`).

---

## Próximo passo

➡️ Veja o [projeto-vite-login/](projeto-vite-login/): o mesmo login organizado em
**rotas, páginas, componentes e serviços**, já com o formulário extraído num
componente reutilizável (`<LoginForm />`) com `props` e `emits`.

Depois, faça os [desafios do nível 1](../../desafios.md), revise o
[Q&A](../../perguntas-respostas.md) e siga para o
[nível 2 — Componentes](../../../nivel-2-componentes/).
