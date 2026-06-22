# 03 — Operadores Lógicos — Perguntas e Respostas

> Tente responder com suas palavras **antes** de abrir cada resposta.

---

### 1. O que `&&`, `||` e `!` fazem?

<details>
<summary>Resposta</summary>

- `&&` (E) → verdadeiro só se **ambos** os lados forem verdadeiros.
- `||` (OU) → verdadeiro se **pelo menos um** lado for verdadeiro.
- `!` (NÃO) → **inverte** o valor booleano.
</details>

---

### 2. Quais são os valores **falsy** do JavaScript?

<details>
<summary>Resposta</summary>

São 8: `false`, `0`, `-0`, `0n`, `""` (string vazia), `null`, `undefined` e `NaN`.

Todo o resto é **truthy** — incluindo `"0"`, `"false"`, `[]` e `{}` (essas pegam muita gente).
</details>

---

### 3. Qual o valor de `[] ? "sim" : "não"`?

<details>
<summary>Resposta</summary>

`"sim"`. Um array vazio é **truthy**! Para testar se está vazio de verdade, use `arr.length === 0`.
</details>

---

### 4. O que `||` realmente devolve? E `&&`?

<details>
<summary>Resposta</summary>

Eles **não** devolvem necessariamente `true`/`false`, e sim **um dos operandos**:

- `||` devolve o **primeiro valor truthy** (ou o último, se todos forem falsy).
- `&&` devolve o **primeiro valor falsy** (ou o último, se todos forem truthy).

```js
"" || "padrão"   // "padrão"
"a" && "b"       // "b"
```
</details>

---

### 5. O que é "curto-circuito"?

<details>
<summary>Resposta</summary>

É quando o JS **para de avaliar** assim que o resultado já está decidido:

- `false && f()` → não chama `f()` (já é false).
- `true || f()` → não chama `f()` (já é true).

Isso é usado tanto para performance quanto para executar algo condicionalmente: `usuario && fazerAlgo()`.
</details>

---

### 6. Qual a diferença entre `||` e `??`?

<details>
<summary>Resposta</summary>

- `||` troca pelo lado direito quando o esquerdo é **falsy** (inclui `0`, `""`, `false`).
- `??` troca **só** quando o esquerdo é `null` ou `undefined`.

```js
0 || 10   // 10  (|| achou 0 falsy)
0 ?? 10   // 0   (?? mantém, pois 0 não é null/undefined)
```

Use `??` quando `0`/`""`/`false` forem valores válidos.
</details>

---

### 7. O que este código faz e por que não dá erro?

```js
const u = { nome: "Ana" };
console.log(u.endereco?.cidade);
```

<details>
<summary>Resposta</summary>

Imprime `undefined`, **sem erro**. O `?.` (optional chaining) interrompe o acesso com segurança quando `u.endereco` é `undefined`, em vez de lançar `TypeError: Cannot read properties of undefined`.
</details>

---

### 8. Qual valor recebe `nome`?

```js
const entrada = "";
const nome = entrada || "Anônimo";
```

<details>
<summary>Resposta</summary>

`"Anônimo"`. Como `""` é falsy, o `||` devolve o lado direito. Esse é o padrão clássico de **valor padrão**.
</details>

---

### 9. Sem rodar: qual o resultado?

```js
true || false && false
```

<details>
<summary>Resposta</summary>

`true`. O `&&` tem **precedência maior** que `||`, então é lido como `true || (false && false)` = `true || false` = `true`.

Na dúvida, use parênteses para deixar explícito.
</details>

---

### 10. Como você inverte um booleano de estado (toggle) no Vue?

<details>
<summary>Resposta</summary>

Com o operador `!`:

```vue
<button @click="aberto = !aberto">Alternar</button>
```

Cada clique troca `true ↔ false`. É o padrão de botão liga/desliga.
</details>

---

### 11. Por que `config.volume ?? 50` é melhor que `config.volume || 50` para um volume?

<details>
<summary>Resposta</summary>

Porque um volume `0` é um valor **válido** (mudo). Com `||`, o `0` (falsy) seria trocado por `50` por engano. Com `??`, o `0` é mantido, pois ele só troca `null`/`undefined`.
</details>
