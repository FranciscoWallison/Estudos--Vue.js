# 01 — Recursividade — Desafios

> Resolva **só com recursão** (sem `for`/`while`), a menos que o desafio peça para comparar.
> Teste cada um no console do navegador (F12) ou no Node.

## Desafio 1.1 — Contagem regressiva
Escreva `contagemRegressiva(n)` que imprime de `n` até `1` e depois `"Decolar! 🚀"`.

```js
contagemRegressiva(3);
// 3
// 2
// 1
// Decolar! 🚀
```

**Critérios:** caso base claro; sem loops.

---

## Desafio 1.2 — Soma de 1 até N
Escreva `somaAte(n)` que devolve a soma de todos os inteiros de `1` até `n`.

```js
somaAte(5); // 15  (1+2+3+4+5)
```

---

## Desafio 1.3 — Potência
Escreva `potencia(base, expoente)` sem usar `Math.pow` nem `**`.

```js
potencia(2, 5); // 32
potencia(7, 0); // 1   (qualquer número elevado a 0 é 1 → ótimo caso base)
```

---

## Desafio 1.4 — Inverter uma string
Escreva `inverter(texto)` que devolve a string ao contrário, **recursivamente**.

```js
inverter("vue"); // "euv"
```

**Dica:** pense em "primeira letra vai para o final" + inverter o resto.

---

## Desafio 1.5 — Fibonacci
A sequência de Fibonacci: `0, 1, 1, 2, 3, 5, 8, 13...` (cada número é a soma dos dois anteriores). Escreva `fib(n)` que devolve o n-ésimo termo.

```js
fib(0); // 0
fib(1); // 1
fib(7); // 13
```

**Critérios:** dois casos base (`n === 0` e `n === 1`).

**Reflexão:** rode `fib(40)` e perceba que demora. Por quê? (Dica: ele recalcula os mesmos valores várias vezes. Pesquise "memoização" depois.)

---

## Desafio 1.6 — Somar dígitos
Escreva `somarDigitos(n)` que soma os dígitos de um número até sobrar... a soma simples.

```js
somarDigitos(123); // 6   (1 + 2 + 3)
somarDigitos(9876); // 30
```

**Dica:** `n % 10` pega o último dígito, `Math.floor(n / 10)` remove ele.

---

## Desafio 1.7 — Achatar array aninhado (desafio final 🔥)
Escreva `achatar(arr)` que transforma um array com sub-arrays em um array plano.

```js
achatar([1, [2, 3], [4, [5, 6]]]); // [1, 2, 3, 4, 5, 6]
```

**Dica:** para cada item, se for array, chame `achatar` nele; senão, inclua o item.
Este é o padrão exato de um **componente recursivo** no Vue — guarde a sensação.

---

## Bônus — Recursão vs Loop
Reescreva o **Desafio 1.2** (`somaAte`) usando um `for`. Compare os dois lados a lado e escreva num comentário: qual é mais legível? Qual usa menos memória?
