# 01 — Recursividade

## O que é?

**Recursividade** é quando uma função **chama a si mesma** para resolver um problema, quebrando-o em pedaços menores e iguais.

A ideia central: *"para resolver o problema grande, resolvo uma versão um pouquinho menor dele — e repito até chegar num caso trivial."*

> Analogia: bonecas russas (matrioscas). Abrir uma boneca revela outra menor, igual. Você continua abrindo até chegar na **menor de todas**, que não abre mais. Essa última é o **caso base**.

## Anatomia de toda recursão

Toda função recursiva **precisa** de duas partes. Se faltar uma, ela quebra.

```js
function recursiva(n) {
  // 1) CASO BASE — a condição de parada. Sem ele = loop infinito.
  if (n === 0) {
    return; // para de chamar a si mesma
  }

  // 2) CASO RECURSIVO — chama a si mesma com um problema MENOR
  recursiva(n - 1); // n diminui → caminha em direção ao caso base
}
```

| Parte | Função | Se faltar... |
|-------|--------|--------------|
| **Caso base** | Condição que **para** a recursão | `Maximum call stack size exceeded` (estouro de pilha) |
| **Caso recursivo** | Chama a si mesma com entrada **menor** | Não é recursão, é só uma função normal |

> ⚠️ Regra prática: o caso recursivo **sempre** tem que se aproximar do caso base. Se `n` nunca diminui, nunca para.

## Exemplo 1 — Contagem regressiva

```js
function contar(n) {
  if (n === 0) {           // caso base
    console.log("Fim! 🚀");
    return;
  }
  console.log(n);          // faz o trabalho
  contar(n - 1);           // caso recursivo (n menor)
}

contar(3);
// 3
// 2
// 1
// Fim! 🚀
```

## Exemplo 2 — Fatorial (recursão que devolve valor)

Fatorial de 4 = `4 × 3 × 2 × 1 = 24`. A definição já é recursiva: `n! = n × (n-1)!`.

```js
function fatorial(n) {
  if (n <= 1) return 1;          // caso base: 0! = 1! = 1
  return n * fatorial(n - 1);    // caso recursivo
}

fatorial(4); // 24
```

### Como o computador executa isso (a pilha de chamadas)

Cada chamada **espera** a próxima terminar antes de fazer a multiplicação:

```
fatorial(4) = 4 * fatorial(3)
              4 * (3 * fatorial(2))
              4 * (3 * (2 * fatorial(1)))
              4 * (3 * (2 * 1))         ← caso base atingido, agora "volta"
              4 * (3 * 2)
              4 * 6
              24
```

> 💡 As chamadas se **empilham** (ida) e depois se **desempilham** calculando o resultado (volta). Isso é a *call stack*. Cada chamada ocupa memória — por isso recursão muito profunda estoura.

## Exemplo 3 — Somar um array

```js
function somar(lista) {
  if (lista.length === 0) return 0;          // caso base: lista vazia soma 0
  const [primeiro, ...resto] = lista;        // pega o 1º e o "resto"
  return primeiro + somar(resto);            // 1º + soma do resto
}

somar([10, 20, 30]); // 60
```

## Recursão vs Loop (iteração)

Quase tudo que se faz com recursão também se faz com um loop. Compare:

```js
// Recursivo
function fatorialR(n) {
  if (n <= 1) return 1;
  return n * fatorialR(n - 1);
}

// Iterativo (com loop)
function fatorialI(n) {
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
}
```

| | Recursão | Loop |
|---|----------|------|
| **Legibilidade** | Ótima para problemas "auto-similares" (árvores, fractais) | Ótima para repetição simples |
| **Memória** | Usa a pilha (pode estourar) | Constante |
| **Velocidade** | Geralmente mais lenta | Geralmente mais rápida |

> 🎯 Use recursão quando o **problema é naturalmente recursivo** (estruturas em árvore, navegar pastas, percorrer JSON aninhado). Use loop para repetição linear simples.

## Erro clássico: esquecer o caso base

```js
function semFim(n) {
  console.log(n);
  return semFim(n - 1); // nunca para!
}
semFim(3); // 3, 2, 1, 0, -1, -2... 💥 Maximum call stack size exceeded
```

Rode isso de propósito uma vez para ver a mensagem. Reconhecer esse erro vai te salvar horas no futuro.

## Onde isso aparece no Vue

Recursão não é só teoria de faculdade — você vai usar em **componentes recursivos**:

- **Árvore de comentários** (comentário tem respostas, que têm respostas...).
- **Menu de navegação aninhado** (item de menu com submenus).
- **Visualizador de JSON / árvore de arquivos.**

Um componente Vue pode renderizar **a si mesmo** (com a opção `name`), exatamente como uma função recursiva:

```vue
<!-- ItemMenu.vue -->
<template>
  <li>
    {{ item.titulo }}
    <ul v-if="item.filhos">
      <!-- o componente se chama de novo para cada filho -->
      <ItemMenu v-for="filho in item.filhos" :key="filho.id" :item="filho" />
    </ul>
  </li>
</template>

<script setup>
defineProps(['item']);
</script>
```

O `v-if="item.filhos"` é o **caso base**: quando não há filhos, a recursão para. 🎯

## Próximos passos

- Responda o [questionário](perguntas-respostas.md).
- Resolva os [desafios](desafios.md).
- Depois siga para [02 — Controle de Fluxo](../02-controle-de-fluxo/).
