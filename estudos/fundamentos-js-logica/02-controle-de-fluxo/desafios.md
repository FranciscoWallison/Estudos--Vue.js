# 02 — Controle de Fluxo — Desafios

> Teste cada um no console (F12) ou no Node. Pense **qual** das três palavras é a certa para cada caso.

## Desafio 2.1 — Pular os negativos
Escreva `somarPositivos(numeros)` que soma só os números **positivos** de um array, usando `continue` para pular os negativos e o zero.

```js
somarPositivos([1, -2, 3, -4, 5]); // 9
```

---

## Desafio 2.2 — Parar na primeira senha fraca
Dada uma lista de senhas, percorra com `for...of` e **pare** (`break`) ao encontrar a primeira senha com menos de 6 caracteres, imprimindo qual é.

```js
const senhas = ["forte123", "abc", "outra456"];
// deve imprimir: "Senha fraca encontrada: abc" e parar
```

---

## Desafio 2.3 — Validar com guard clauses
Escreva `criarUsuario(nome, idade)` que devolve mensagens de erro **saindo cedo** com `return`:
- Se `nome` for vazio → `"Nome obrigatório"`.
- Se `idade` for menor que 18 → `"Precisa ser maior de idade"`.
- Caso contrário → `"Usuário criado: <nome>"`.

```js
criarUsuario("", 20);     // "Nome obrigatório"
criarUsuario("Ana", 15);  // "Precisa ser maior de idade"
criarUsuario("Ana", 20);  // "Usuário criado: Ana"
```

**Critério:** use 3 `return`, sem `else`.

---

## Desafio 2.4 — Encontrar e devolver
Escreva `acharPar(numeros)` que devolve o **primeiro** número par do array (ou `null` se não houver), usando `return` dentro do loop.

```js
acharPar([1, 3, 5, 8, 10]); // 8
acharPar([1, 3, 5]);        // null
```

**Reflita:** por que `return` é melhor que `break` aqui? (Dica: você quer *devolver* o valor.)

---

## Desafio 2.5 — FizzBuzz com `continue`
Imprima de 1 a 20. Para múltiplos de 3 imprima `"Fizz"`, para múltiplos de 5 `"Buzz"`, para múltiplos de ambos `"FizzBuzz"`, senão o número. Tente usar `continue` para evitar `if/else if` encadeado.

**Dica:** monte uma string e, se ela ficar vazia, imprima o número.

---

## Desafio 2.6 — A pegadinha do `forEach` 🔍
Escreva DUAS versões de uma função `imprimirAte(numeros, limite)` que imprime os números até encontrar o `limite` (e para nele):

1. Tentando com `forEach` + `return`.
2. Com `for...of` + `break`.

```js
imprimirAte([1, 2, 3, 4, 5], 3);
// Esperado: 1, 2  (parar ANTES do 3)
```

**Critério:** explique num comentário por que a versão com `forEach` **não consegue** parar de verdade, e a com `for...of` consegue.

---

## Desafio 2.7 — Menu com `switch` (desafio final 🔥)
Escreva `acaoMenu(opcao)` usando `switch` que retorna:
- `1` → `"Novo arquivo"`
- `2` → `"Abrir"`
- `3` → `"Salvar"`
- qualquer outra → `"Opção inválida"`

Depois, **remova de propósito** um `break` e observe o "fall-through" acontecer. Escreva num comentário o que mudou.
