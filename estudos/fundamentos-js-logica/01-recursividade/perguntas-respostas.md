# 01 — Recursividade — Perguntas e Respostas

> Tente responder com suas palavras **antes** de abrir cada resposta.

---

### 1. O que é uma função recursiva?

<details>
<summary>Resposta</summary>

É uma função que **chama a si mesma** para resolver o problema, quebrando-o em versões menores até chegar a um caso trivial (o caso base).
</details>

---

### 2. Quais são as DUAS partes obrigatórias de toda recursão?

<details>
<summary>Resposta</summary>

1. **Caso base** — a condição de parada.
2. **Caso recursivo** — a chamada a si mesma com uma entrada **menor**, caminhando em direção ao caso base.

Sem o caso base → loop infinito. Sem o caso recursivo → não é recursão.
</details>

---

### 3. O que acontece se você esquecer o caso base?

<details>
<summary>Resposta</summary>

A função chama a si mesma para sempre, empilhando chamadas até a memória da pilha acabar. O JavaScript lança:

```
RangeError: Maximum call stack size exceeded
```

(estouro de pilha / *stack overflow*).
</details>

---

### 4. Qual o resultado e por quê?

```js
function f(n) {
  if (n === 0) return 0;
  return n + f(n - 1);
}
f(3);
```

<details>
<summary>Resposta</summary>

**6.** A função soma `n + (n-1) + ... + 0`:

```
f(3) = 3 + f(2)
     = 3 + (2 + f(1))
     = 3 + (2 + (1 + f(0)))
     = 3 + (2 + (1 + 0))
     = 6
```
</details>

---

### 5. O que é a "call stack" (pilha de chamadas)?

<details>
<summary>Resposta</summary>

É a estrutura onde o JavaScript **empilha** cada chamada de função que ainda não terminou. Numa recursão, as chamadas se empilham na "ida" e se desempilham na "volta", quando cada uma recebe o resultado da chamada interna. Cada chamada ocupa memória — por isso recursão muito profunda estoura a pilha.
</details>

---

### 6. Recursão é sempre melhor que um loop?

<details>
<summary>Resposta</summary>

**Não.** Loops geralmente são mais rápidos e usam memória constante. Recursão brilha quando o problema é **naturalmente recursivo** (árvores, estruturas aninhadas, fractais), onde a versão com loop ficaria confusa. Para repetição linear simples, prefira o loop.
</details>

---

### 7. Por que, no fatorial, a multiplicação só acontece na "volta" da recursão?

<details>
<summary>Resposta</summary>

Porque `return n * fatorial(n - 1)` precisa do **resultado** de `fatorial(n - 1)` antes de multiplicar. Então cada chamada fica "pausada" esperando a de dentro terminar. Só quando o caso base devolve `1` é que as multiplicações vão sendo resolvidas, de dentro para fora.
</details>

---

### 8. Como recursão se manifesta no Vue?

<details>
<summary>Resposta</summary>

Em **componentes recursivos**: um componente que renderiza a si mesmo (usando a opção `name` ou em `<script setup>` automaticamente pelo nome do arquivo). Útil para menus aninhados, árvores de comentários e visualizadores de JSON. O `v-if` que checa se há filhos funciona como o **caso base**.
</details>

---

### 9. Qual o problema desta função?

```js
function conta(n) {
  console.log(n);
  conta(n + 1);
}
```

<details>
<summary>Resposta</summary>

Dois problemas:
1. **Não tem caso base** → nunca para.
2. O argumento **cresce** (`n + 1`) em vez de diminuir, então mesmo que houvesse um caso base como `if (n === 0)`, ela se afastaria dele.

Resultado: estouro de pilha.
</details>

---

### 10. O que é uma chamada recursiva "em cauda" (tail call)? (avançado)

<details>
<summary>Resposta</summary>

É quando a chamada recursiva é a **última** operação da função, sem nada pendente depois dela (nenhuma multiplicação/soma "esperando").

```js
// Tail call: nada acontece depois de fatorial(...)
function fatorial(n, acc = 1) {
  if (n <= 1) return acc;
  return fatorial(n - 1, n * acc); // último passo
}
```

Algumas linguagens otimizam isso para não crescer a pilha. **Atenção:** a maioria dos motores JS (V8/navegadores) **não** aplica essa otimização na prática, então não conte com ela para evitar estouro de pilha.
</details>
