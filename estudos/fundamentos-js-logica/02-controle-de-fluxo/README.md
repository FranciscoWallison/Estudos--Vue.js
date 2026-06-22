# 02 — Controle de Fluxo: `return`, `break` e `continue`

Três palavrinhas que mudam o rumo da execução. Parecem iguais para iniciantes, mas fazem coisas **bem diferentes**. Entender a diferença evita a maioria dos bugs de loop.

## Visão geral em uma tabela

| Palavra | O que faz | Onde funciona | "Distância" do salto |
|---------|-----------|---------------|----------------------|
| `return` | **Sai da função inteira** (e opcionalmente devolve um valor) | Dentro de **funções** | Encerra a função |
| `break` | **Sai do loop** (ou do `switch`) | Dentro de `for`, `while`, `switch` | Para o loop inteiro |
| `continue` | **Pula para a próxima iteração** do loop | Dentro de `for`, `while` | Pula só a volta atual |

> 🧠 Metáfora — você está lendo uma lista de tarefas em voz alta:
> - `continue` = "essa eu pulo, **próxima**!"
> - `break` = "chega, **parei de ler a lista**."
> - `return` = "**saí da sala** e entreguei minha resposta."

---

## `return` — sai da função

Encerra a função **imediatamente**. Nada depois dele roda. Pode (ou não) devolver um valor.

```js
function saudar(nome) {
  if (!nome) {
    return "Nome vazio!"; // sai aqui, com esse valor
  }
  return `Olá, ${nome}!`; // só chega aqui se houver nome
}

saudar("");     // "Nome vazio!"
saudar("Ana");  // "Olá, Ana!"
```

### `return` como "guard clause" (cláusula de guarda)

Padrão muito usado: validar e sair cedo, evitando `if` aninhado.

```js
function processar(usuario) {
  if (!usuario) return;          // sai cedo se não há usuário
  if (!usuario.ativo) return;    // sai cedo se inativo
  // daqui pra baixo, o código está "protegido"
  console.log("Processando", usuario.nome);
}
```

> 💡 `return` sozinho (sem valor) devolve `undefined` e serve só para **parar** a função.

---

## `break` — sai do loop

Para o loop **inteiro** na hora. Útil quando você já achou o que procurava.

```js
const numeros = [4, 8, 15, 16, 23, 42];

for (const n of numeros) {
  if (n === 16) {
    console.log("Achei o 16! Parando.");
    break; // não continua para 23 e 42
  }
  console.log("Verificando", n);
}
// Verificando 4
// Verificando 8
// Verificando 15
// Achei o 16! Parando.
```

`break` também encerra cada `case` de um `switch` (sem ele, a execução "vaza" para o próximo case):

```js
switch (cor) {
  case "vermelho":
    console.log("Pare!");
    break; // sem isto, cairia no "amarelo" também
  case "amarelo":
    console.log("Atenção!");
    break;
  default:
    console.log("Siga.");
}
```

---

## `continue` — pula para a próxima volta

Pula o **resto** da iteração atual e vai direto para a próxima. O loop **não** para.

```js
for (let i = 1; i <= 5; i++) {
  if (i % 2 === 0) {
    continue; // pula os pares
  }
  console.log(i); // só roda para ímpares
}
// 1
// 3
// 5
```

---

## Os três lado a lado (o mesmo loop, resultados diferentes)

```js
// continue → pula o 3, mas segue até o fim
for (let i = 1; i <= 5; i++) {
  if (i === 3) continue;
  console.log(i);
}
// 1, 2, 4, 5

// break → para tudo ao chegar no 3
for (let i = 1; i <= 5; i++) {
  if (i === 3) break;
  console.log(i);
}
// 1, 2

// return → só dentro de função: encerra a função no 3
function ate3() {
  for (let i = 1; i <= 5; i++) {
    if (i === 3) return;
    console.log(i);
  }
  console.log("Esta linha NUNCA roda se return disparar");
}
ate3();
// 1, 2
```

---

## Pegadinha importante: `return`/`break`/`continue` NÃO funcionam dentro de `.forEach()`

Métodos como `forEach`, `map` e `filter` recebem uma **função de callback**. Um `return` dentro deles sai só do callback (aquela "volta"), **não** do loop nem da função externa. E `break`/`continue` dão **erro de sintaxe** ali.

```js
const numeros = [1, 2, 3, 4];

// ❌ Não faz o que você espera
numeros.forEach(n => {
  if (n === 2) return; // sai só DESTA volta — funciona como um "continue"
  console.log(n);
});
// 1, 3, 4   (não dá pra "break" um forEach!)

// ✅ Se você precisa parar no meio, use um for clássico
for (const n of numeros) {
  if (n === 2) break; // aqui sim para o loop
  console.log(n);
}
// 1
```

> 🎯 Regra: **precisa interromper o loop no meio? Use `for`/`for...of`, não `forEach`.**

---

## Onde isso aparece no Vue

- **`return` em `computed` e métodos**: toda propriedade computada devolve seu valor com `return`. Guard clauses (`if (!props.user) return ...`) deixam métodos e `setup()` mais limpos.
- **`return` cedo em validações de formulário**: validar e sair antes de enviar dados.
- **`break`/`continue`**: aparecem quando você processa listas dentro de métodos antes de jogar no template — por exemplo, montar um array filtrado, achar o primeiro item que bate uma condição, etc.
- No **template**, você não usa essas palavras (lá se usa `v-if`, `v-for`), mas a lógica que **alimenta** o template, no `<script>`, vive disso.

```js
// dentro de <script setup>
function primeiroDisponivel(produtos) {
  for (const p of produtos) {
    if (!p.emEstoque) continue;  // pula esgotados
    return p;                    // devolve o primeiro disponível e sai
  }
  return null;                   // nenhum disponível
}
```

## Próximos passos

- Responda o [questionário](perguntas-respostas.md).
- Resolva os [desafios](desafios.md).
- Depois siga para [03 — Operadores Lógicos](../03-operadores-logicos/).
