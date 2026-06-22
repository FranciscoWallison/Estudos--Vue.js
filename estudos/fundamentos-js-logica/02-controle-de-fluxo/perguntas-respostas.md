# 02 — Controle de Fluxo — Perguntas e Respostas

> Tente responder com suas palavras **antes** de abrir cada resposta.

---

### 1. Em uma frase, qual a diferença entre `return`, `break` e `continue`?

<details>
<summary>Resposta</summary>

- `return` → sai da **função inteira** (com um valor).
- `break` → sai do **loop** (ou `switch`).
- `continue` → pula para a **próxima iteração** do loop.
</details>

---

### 2. Onde cada um pode ser usado?

<details>
<summary>Resposta</summary>

- `return` → só dentro de **funções**.
- `break` → dentro de `for`, `while`, `do...while` e `switch`.
- `continue` → dentro de `for`, `while`, `do...while`.

Usar `break`/`continue` fora de um loop é **erro de sintaxe**.
</details>

---

### 3. O que imprime?

```js
for (let i = 1; i <= 4; i++) {
  if (i === 2) continue;
  console.log(i);
}
```

<details>
<summary>Resposta</summary>

```
1
3
4
```

O `2` é pulado pelo `continue`, mas o loop continua.
</details>

---

### 4. E este, o que imprime?

```js
for (let i = 1; i <= 4; i++) {
  if (i === 2) break;
  console.log(i);
}
```

<details>
<summary>Resposta</summary>

```
1
```

Ao chegar em `2`, o `break` para o loop inteiro.
</details>

---

### 5. O que é uma "guard clause" e por que usar `return` para ela?

<details>
<summary>Resposta</summary>

É uma verificação no **início** da função que sai cedo quando algo não está válido, evitando `if` aninhado:

```js
function processar(user) {
  if (!user) return;        // guarda
  if (!user.ativo) return;  // guarda
  // código principal "protegido", sem aninhamento
}
```

Deixa o código mais plano e legível.
</details>

---

### 6. Por que `break` não funciona dentro de `forEach`?

<details>
<summary>Resposta</summary>

Porque `forEach` executa uma **função callback** a cada item. `break`/`continue` só existem dentro de loops "de verdade" (`for`, `while`), não dentro de funções — então dão **erro de sintaxe** no `forEach`. Para poder interromper, use `for`/`for...of`.
</details>

---

### 7. O que acontece com `return` dentro de um `forEach`?

<details>
<summary>Resposta</summary>

Ele sai apenas **daquela** execução do callback (aquela volta), funcionando parecido com um `continue`. Ele **não** para o `forEach` nem sai da função externa. Por isso não dá para "abortar" um `forEach` no meio.
</details>

---

### 8. No `switch`, o que acontece se eu esquecer o `break`?

<details>
<summary>Resposta</summary>

A execução **"vaza"** (fall-through) para o próximo `case`, rodando o código dele também, até encontrar um `break` ou o fim do `switch`.

```js
switch (x) {
  case 1:
    console.log("um");   // se x === 1 e não tiver break...
  case 2:
    console.log("dois"); // ...isto também roda!
    break;
}
```
</details>

---

### 9. Qual a saída?

```js
function achar(lista, alvo) {
  for (const item of lista) {
    if (item === alvo) return true;
  }
  return false;
}
console.log(achar([1, 2, 3], 2));
```

<details>
<summary>Resposta</summary>

`true`. Ao encontrar o `2`, o `return true` sai imediatamente da função. Se nada bater, o loop termina e cai no `return false`.
</details>

---

### 10. Em qual situação `continue` é mais elegante que um `if` grande em volta?

<details>
<summary>Resposta</summary>

Quando você quer **ignorar** certos itens e processar o resto. Em vez de embrulhar todo o corpo do loop num `if`, você "pula" cedo:

```js
// Em vez disto:
for (const p of produtos) {
  if (p.emEstoque) {
    // ... muito código aninhado ...
  }
}

// Faça isto:
for (const p of produtos) {
  if (!p.emEstoque) continue; // pula e segue
  // ... código no nível principal, sem aninhar ...
}
```
</details>
