# Exemplo 02 — Carrinho de compras (Options API)

> Continuação direta do [01-reatividade](../01-reatividade/). Lá o problema era um
> contador; aqui é um mini **carrinho** (produto, preço, quantidade e total).
> O objetivo é o mesmo: sentir a diferença entre **atualizar a tela na mão** (JS puro)
> e **deixar o Vue atualizar sozinho**.

## O problema

Um produto com preço fixo e um contador de quantidade. Os botões **+ / −** mudam a
quantidade, e o campo **Total** mostra `preço × quantidade` sempre atualizado.

> **Regra de ouro do Vue:** você muda o **dado**, não a tela. A tela é só um reflexo do dado.

## Arquivos

| Arquivo | O que é | Como rodar |
|--------|---------|-----------|
| [js-puro.html](js-puro.html) | JavaScript puro (imperativo) | duplo-clique abre no navegador |
| [vue3-cdn.html](vue3-cdn.html) | Vue 3 **Options API** via CDN | duplo-clique abre no navegador |

Abra os dois **lado a lado**. Eles se comportam igual; o código por trás é bem diferente.
Como ambos usam CDN (Bootstrap + `vue.global.js`), **não precisa instalar nada** — igual
você já fez no exemplo 00 e 01.

> 💡 **Por que Options API aqui?** Os exemplos 00 e 01 usam a **Composition API**
> (`setup` + `ref`). Este exemplo usa a **Options API** (`data` / `methods` / `computed`)
> de propósito: é a sintaxe do Vue 2 que você encontra no curso Origamid e em código
> legado. Vale conhecer as duas. Veja a seção 4 para a tradução entre elas.

---

## 1. A grande diferença: imperativo vs declarativo

### JavaScript puro = imperativo ("COMO fazer")

No `js-puro.html` você manipula o DOM na mão: busca os elementos, escuta cliques e
atualiza o texto você mesmo.

```js
function atualizarUI() {
  quantidadeEl.innerText = dados.quantidade;          // você manda atualizar
  precoTotalEl.innerText = dados.preco * dados.quantidade;
}
```

O **dado** (`dados`) e a **tela** (`innerText`) são duas coisas separadas. Se você mudar
`dados.quantidade` e esquecer de chamar `atualizarUI()`, a tela mostra o valor antigo.
É a fonte nº 1 de bugs em JS puro.

### Vue = declarativo ("O QUÊ mostrar")

No `vue3-cdn.html` você descreve o resultado no template e o Vue cuida do como:

```html
<h5>{{ produto }}</h5>
<button @click="adicionar">+</button>
<p>Total: R$ {{ precoTotal }}</p>
```

Mudou o dado → a tela muda. Você nunca mais escreve `querySelector` nem `innerText`.

---

## 2. As 3 peças que substituem o código antigo

| No código vanilla | No Vue (Options API) | Para que serve |
|---|---|---|
| `const dados = {...}` | `data()` | Estado reativo. Mudou → tela atualiza |
| `addEventListener('click', ...)` | `@click` | Liga o clique direto no botão do HTML |
| `dados.preco * dados.quantidade` (recalculado à mão em `atualizarUI()`) | `computed` | Valor derivado, recalculado automaticamente |
| `innerText` / `querySelector` | `{{ }}` | Imprime o dado na tela (interpolação) |

---

## 3. Lendo a versão Vue por partes

### a) `data()` — o coração reativo

```js
data() {
  return { produto: 'Roupa', preco: 49, quantidade: 0 };
}
```

É o equivalente ao seu `const dados`, mas **reativo**. Quando `quantidade` muda, tudo que
usa `quantidade` na tela é redesenhado.

### b) O template — HTML que "fala" com os dados

```html
<h5>{{ produto }}</h5>                  <!-- imprime "Roupa" -->
<button @click="adicionar">+</button>   <!-- clique chama o método -->
<p>Total: R$ {{ precoTotal }}</p>       <!-- valor calculado -->
```

- `{{ }}` → imprime um valor (substitui o `innerText`).
- `@click="adicionar"` → atalho para `addEventListener` (substitui as 2 últimas linhas do JS puro).

### c) `computed` — o pulo do gato 🐱

No vanilla você tinha que lembrar de chamar `atualizarUI()` em todo lugar. Se esquecesse,
a tela ficava errada. No Vue:

```js
computed: {
  precoTotal() {
    return this.preco * this.quantidade;
  }
}
```

`precoTotal` se recalcula sozinho sempre que `preco` ou `quantidade` mudam — e é
**cacheado**. Sua função `atualizarUI()` simplesmente deixou de existir.

### d) `methods` — só a lógica de negócio

```js
methods: {
  adicionar() { this.quantidade++; },
  remover()   { if (this.quantidade > 0) this.quantidade--; }
}
```

Repare: os métodos só **mudam o dado**. Não tocam na tela. Compare com o `adicionar()`
do JS puro, que precisava chamar `atualizarUI()`. Aqui não precisa.

> Note o `this.` — na Options API o estado de `data()` é acessado via `this.quantidade`,
> `this.preco`, etc.

---

## 4. Options API vs Composition API

Este exemplo está em **Options API**. Abaixo, o **mesmo** componente nas duas sintaxes —
para você reconhecer ambas:

```js
// Options API (este exemplo / Vue 2)
createApp({
  data() {
    return { preco: 49, quantidade: 0 };
  },
  computed: {
    precoTotal() { return this.preco * this.quantidade; }
  },
  methods: {
    adicionar() { this.quantidade++; }
  }
}).mount('#root');
```

```js
// Composition API (exemplos 00 e 01 / Vue 3 moderno)
const { createApp, ref, computed } = Vue;
createApp({
  setup() {
    const preco = ref(49);
    const quantidade = ref(0);
    const precoTotal = computed(() => preco.value * quantidade.value);
    function adicionar() { quantidade.value++; }
    return { preco, quantidade, precoTotal, adicionar };
  }
}).mount('#root');
```

| | Options API | Composition API |
|---|---|---|
| Estado | `data() { return {...} }` | `ref()` / `reactive()` |
| Acesso ao estado | `this.quantidade` | `quantidade.value` (no JS) |
| Organização | por opções (`data`, `methods`, `computed`) | por lógica, dentro do `setup()` |
| Reuso de lógica | mixins | composables (`useAlgo()`) |

A **reatividade é a mesma** nas duas — muda só a sintaxe. Para projetos novos, prefira
Composition API + `<script setup>` (é o que o resto deste nível usa).

---

## 5. Resumo: o que sumiu do código

Ao migrar do JS puro para o Vue, estas coisas desapareceram (e isso é bom!):

- ❌ `document.querySelector(...)` (6 linhas)
- ❌ `addEventListener(...)` (2 linhas)
- ❌ A função `atualizarUI()` inteira
- ❌ As linhas que setavam `.innerText` manualmente

Tudo isso virou **reatividade automática**.

---

## 6. Experimentos para fixar

Faça no `vue3-cdn.html` (do mais fácil ao mais difícil):

1. **Fácil:** desabilite o botão `−` quando a quantidade for 0, com
   `:disabled="quantidade === 0"`.
2. **Médio:** adicione um segundo produto e mostre o **total geral** somando os dois
   (vai precisar de uma lista/array no `data`).
3. **Avançado:** formate o preço como moeda brasileira (`R$ 49,00`) usando outra
   `computed` com `Intl.NumberFormat`.

Depois, prove o problema do JS puro: no `js-puro.html`, comente a chamada `atualizarUI()`
dentro de `adicionar()` e clique no `+`. → O número no objeto muda, mas a tela congela.
Esse é exatamente o bug que o Vue elimina.

---

## Próximo passo

➡️ [03-tela-de-login](../03-tela-de-login/) — aplica `v-model`, validação com `computed`
e `@submit.prevent` num formulário de login (só Vue 3).
