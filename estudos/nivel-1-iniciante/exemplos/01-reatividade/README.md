# Exemplo 01 — Reatividade e Virtual DOM

> Baseado no exercício `0105-reatividade-e-virtual-dom` do curso Origamid (que usa Vue 2).
> Aqui mostramos o **mesmo problema** em três versões para você sentir a diferença.

## O problema

Um produto com preço fixo e um contador de quantidade. Botões **Adicionar/Remover**
mudam a quantidade, e um campo **Total** mostra `preço × quantidade` sempre atualizado.

## Arquivos

| Arquivo | O que é | Como rodar |
|--------|---------|-----------|
| [js-puro.html](js-puro.html) | JavaScript puro (imperativo) | duplo-clique abre no navegador |
| [vue3-cdn.html](vue3-cdn.html) | Vue 3 Composition API via CDN | duplo-clique abre no navegador |
| [ProdutoCard.vue](ProdutoCard.vue) | Forma moderna definitiva (SFC) | precisa de Vite — ver instruções no topo do arquivo |

Abra `js-puro.html` e `vue3-cdn.html` lado a lado. Eles **se comportam igual**,
mas o código por trás é muito diferente.

---

## 1. A grande diferença: imperativo vs declarativo

### JavaScript puro = imperativo ("COMO fazer")

Você escreve, passo a passo, **como** a tela deve ser atualizada:

```js
function incrementar() {
  dados.total++;       // muda o dado
  atualizarUI();       // ...e VOCÊ tem que mandar redesenhar
}

function atualizarUI() {
  total.innerText = dados.total;
  precoTotal.innerText = dados.total * dados.preco;
}
```

O dado (`dados`) e a tela (`innerText`) são **duas coisas separadas**. Nada liga
uma à outra. Se você mudar `dados.total` e esquecer de chamar `atualizarUI()`,
a tela mostra o valor antigo. É a fonte número 1 de bugs em JS puro.

### Vue = declarativo ("O QUÊ mostrar")

Você descreve o **resultado final** no template e deixa o Vue descobrir o como:

```html
<span>{{ total }}</span>
<p>Total: R$ {{ valorTotal }}</p>
```

```js
const total = ref(0)
const valorTotal = computed(() => preco.value * total.value)

function adicionar() {
  total.value++   // só isso. A tela se atualiza sozinha.
}
```

O template está **amarrado** ao dado. Mudou o dado → a tela muda. Você nunca
escreve "atualizarUI".

---

## 2. Conceito por conceito

### `ref()` — o valor reativo

```js
const total = ref(0)
```

`ref` envelopa um valor e avisa o Vue: "observe isto". Quando o valor muda, o Vue
sabe e re-renderiza só as partes do template que usam esse valor.

- **No JavaScript** (dentro do `setup`/`<script setup>`), você lê e escreve com `.value`:
  ```js
  total.value++         // escrever
  console.log(total.value)  // ler
  ```
- **No template**, o `.value` é automático — escreva só `{{ total }}`.

> Por que `.value`? Porque em JS não dá para "observar" um número solto
> (`let x = 0`). O Vue precisa de um objeto (`{ value: 0 }`) para interceptar
> leituras e escritas. O `ref` é esse objeto.

### `computed()` — valor que se recalcula sozinho

```js
const valorTotal = computed(() => preco.value * total.value)
```

É o substituto automático da função `atualizarUI()` do JS puro. Sempre que
`preco` ou `total` mudam, `valorTotal` é recalculado — sem você pedir.

Vantagem extra: é **cacheado**. Se nada de que ele depende mudou, o Vue reusa o
último resultado em vez de recalcular.

> Poderíamos escrever `{{ preco * total }}` direto no template (e funciona).
> Mas usar `computed` é mais idiomático: o cálculo fica nomeado, reutilizável e
> testável.

### `@click` — escutar eventos

```html
<button @click="adicionar">Adicionar</button>
```

`@click` é atalho para `v-on:click`. Substitui o `addEventListener` manual do JS
puro. Você só aponta a função; o Vue liga e desliga o evento pra você (inclusive
limpa quando o componente é destruído — sem memory leak).

### `{{ }}` — interpolação

```html
<span>{{ total }}</span>
```

"Coloque aqui o valor de `total`, e mantenha atualizado". É o substituto do
`element.innerText = valor`.

---

## 3. Tabela comparativa

| Tarefa | JS puro | Vue 3 |
|-------|---------|-------|
| Guardar estado | `const dados = {}` | `const total = ref(0)` |
| Pegar elemento | `document.querySelector(...)` | (não precisa) |
| Mostrar valor | `el.innerText = x` | `{{ x }}` |
| Valor calculado | recalcular na mão | `computed(() => ...)` |
| Reagir a clique | `addEventListener` | `@click="fn"` |
| Atualizar a tela | chamar `atualizarUI()` | automático |
| Linhas de código | ~25 | ~12 |
| Risco de dessincronizar | alto | praticamente zero |

---

## 4. Vue 2 vs Vue 3 (o curso usa Vue 2)

O curso Origamid usa a sintaxe **Vue 2 / Options API**:

```js
// Vue 2 — Options API
new Vue({
  el: "#comercio",
  data: {
    preco: 69,
    total: 0
  }
})
```

A forma **moderna (Vue 3 / Composition API)** equivalente:

```js
// Vue 3 — Composition API
import { createApp, ref } from 'vue'

createApp({
  setup() {
    const preco = ref(69)
    const total = ref(0)
    return { preco, total }
  }
}).mount("#comercio")
```

Diferenças principais:

| | Vue 2 (curso) | Vue 3 (moderno) |
|---|---|---|
| Criar app | `new Vue({ el })` | `createApp({}).mount()` |
| Estado | `data: { }` | `ref()` / `reactive()` |
| Organização | por opções (`data`, `methods`, `computed`) | por lógica, no `setup()` |
| Reuso de lógica | mixins (problemáticos) | composables (`useAlgo()`) |

O conceito de **reatividade é o mesmo** nas duas versões — muda só a sintaxe.
Aprenda pelo curso, mas escreva projetos novos em Vue 3 + `<script setup>`.

---

## 5. Experimentos para fixar

Faça estas mudanças e observe o que acontece:

1. **No `js-puro.html`**: comente a chamada `atualizarUI()` dentro de
   `incrementar()`. Clique em Adicionar. → A quantidade no objeto muda, mas a tela
   congela. Esse é o problema que o Vue resolve.

2. **No `vue3-cdn.html`**: adicione em qualquer lugar do template
   `<p>Dobro da quantidade: {{ total * 2 }}</p>`. → Funciona na hora, sem mexer em
   nenhuma função. No JS puro, você teria que criar o elemento, pegar a referência
   e atualizar dentro de `atualizarUI()`.

3. **No `vue3-cdn.html`**: troque o `computed` por uma função normal
   `function valorTotal() { return preco.value * total.value }` e use
   `{{ valorTotal() }}` no template. → Funciona, mas perde o cache. Use o DevTools
   para ver a diferença em apps grandes.

4. Acrescente um botão **Zerar** que faz `total.value = 0`. Compare quantas linhas
   isso exige em cada versão.
