# 03 — Operadores Lógicos — Desafios

> Teste tudo no console (F12) ou no Node. Antes de rodar, **tente prever** o resultado.

## Desafio 3.1 — Pode entrar na festa?
Escreva `podeEntrar(idade, temConvite)` que devolve `true` só se a pessoa tiver **18 anos ou mais E** um convite.

```js
podeEntrar(20, true);  // true
podeEntrar(16, true);  // false
podeEntrar(20, false); // false
```

---

## Desafio 3.2 — Dia de folga
Escreva `ehFolga(fimDeSemana, feriado)` que devolve `true` se for fim de semana **OU** feriado.

```js
ehFolga(false, true);  // true
ehFolga(false, false); // false
```

---

## Desafio 3.3 — Nome padrão
Escreva `boasVindas(nome)` que devolve `"Bem-vindo(a), <nome>!"`, mas se o nome vier vazio, use `"Visitante"`. Resolva com **`||`** em uma linha.

```js
boasVindas("Ana"); // "Bem-vindo(a), Ana!"
boasVindas("");    // "Bem-vindo(a), Visitante!"
```

---

## Desafio 3.4 — Caça aos truthy/falsy
Sem rodar, anote num comentário se cada um é `truthy` ou `falsy`. Depois confira no console com `Boolean(valor)`:

```js
0, "", "0", [], {}, null, undefined, NaN, "false", -1, " "
```

**Critério:** acertar `"0"`, `[]` e `{}` (são truthy!) e `" "` (espaço é truthy).

---

## Desafio 3.5 — `||` vs `??`
Dada a configuração abaixo, escreva os valores finais esperados e explique a diferença:

```js
const config = { volume: 0, nome: "" };

const a = config.volume || 50;
const b = config.volume ?? 50;
const c = config.nome || "Sem nome";
const d = config.nome ?? "Sem nome";
// a = ?  b = ?  c = ?  d = ?
```

**Critério:** explicar por que `a !== b` e `c !== d`.

---

## Desafio 3.6 — Acesso seguro com `?.`
Dado o objeto abaixo, escreva expressões que devolvam:
1. O nome do usuário.
2. A cidade (que **não existe**) sem dar erro, devolvendo `"Não informada"`.

```js
const usuario = {
  nome: "Ana",
  contato: { email: "ana@exemplo.com" }
};
// 1) usuario.???                       -> "Ana"
// 2) usuario.endereco?.??? ?? "???"    -> "Não informada"
```

---

## Desafio 3.7 — Validador de formulário (desafio final 🔥)
Escreva `formularioValido(form)` que devolve `true` somente se **todas** estas condições forem verdadeiras, combinando os operadores:
- `form.email` existe e contém `"@"`.
- `form.senha` tem 6 caracteres ou mais.
- `form.aceitouTermos` é `true`.

```js
formularioValido({ email: "a@b.com", senha: "123456", aceitouTermos: true });  // true
formularioValido({ email: "ab.com",  senha: "123456", aceitouTermos: true });  // false (sem @)
formularioValido({ email: "a@b.com", senha: "123",    aceitouTermos: true });  // false (senha curta)
formularioValido({ email: "a@b.com", senha: "123456", aceitouTermos: false }); // false
```

**Dica:** `form.email?.includes("@")` protege contra `email` ausente. Junte tudo com `&&`.

---

## Bônus — Toggle no Vue
No exemplo de login que você já tem (`03-tela-de-login`), adicione um botão "👁️ mostrar senha" que alterna o `type` do input entre `"password"` e `"text"` usando `!` num `ref` booleano (`mostrarSenha = !mostrarSenha`). Conecta os 3 temas: lógica + reatividade.
