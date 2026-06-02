# Exemplo 00 — Do DOM ao Vue

> A **porta de entrada** do Nível 1. Comece por aqui, depois vá para [01-reatividade](../01-reatividade/).
>
> Objetivo: sentir na pele o caminho **DOM puro → Vue → `createApp` → arquitetura → ferramentas**.

Todos os exemplos usam o **mesmo problema** (uma lista de tarefas — To-Do) para você
comparar o "antes e depois" sem se distrair com regras de negócio diferentes.

---

## Ordem de leitura

| # | Arquivo | O que mostra | Como rodar |
|---|---------|--------------|-----------|
| 1 | [01-dom-puro.html](01-dom-puro.html) | To-Do feito 100% na mão com a API do DOM | duplo-clique abre no navegador |
| 2 | [02-vue-cdn.html](02-vue-cdn.html) | O **mesmo** To-Do em Vue 3 (via CDN) | duplo-clique abre no navegador |
| 3 | [03-createApp-anatomia.html](03-createApp-anatomia.html) | `createApp` dissecado peça por peça | duplo-clique abre no navegador |
| 4 | [ARQUITETURA.md](ARQUITETURA.md) | Estrutura de pastas de um projeto real | leitura |
| 5 | [FERRAMENTAS.md](FERRAMENTAS.md) | O ecossistema (Vite, DevTools, ESLint…) | leitura |
| 6 | [projeto-vite-todo/](projeto-vite-todo/) | O To-Do como **projeto Vite de verdade** | `npm install && npm run dev` |

Abra `01-dom-puro.html` e `02-vue-cdn.html` **lado a lado**. Eles se comportam igual;
o código por trás é o dia e a noite.

---

## 1. O que é o DOM

Quando o navegador lê seu HTML, ele não guarda texto — ele monta uma **árvore de
objetos** na memória chamada **DOM** (*Document Object Model*). Cada tag vira um
**nó** (um objeto JavaScript) com propriedades (`.innerText`, `.classList`) e
métodos (`.addEventListener`, `.appendChild`).

```
document
 └── body
      └── ul#lista
           ├── li → "Estudar Vue"
           └── li → "Tomar café"
```

Mexer na tela com JavaScript = manipular esses objetos na mão. É o que o
`01-dom-puro.html` faz.

---

## 2. Imperativo (DOM puro) vs Declarativo (Vue)

### DOM puro = você descreve o **COMO**, passo a passo

```js
// adicionar uma tarefa na tela, na mão:
const li = document.createElement("li");   // cria o nó
li.innerText = texto;                       // preenche
botaoRemover.addEventListener("click", ...);// liga o evento
ul.appendChild(li);                         // pendura na árvore
```

O **dado** (array de tarefas) e a **tela** (`<li>`s) são **coisas separadas**.
Nada liga uma à outra. Se você mudar o array e esquecer de redesenhar, a tela
"congela". É a fonte nº 1 de bugs.

### Vue = você descreve o **QUÊ**, e ele cuida do como

```html
<li v-for="t in tarefas" :key="t.id">{{ t.texto }}</li>
```

```js
const tarefas = ref([])
tarefas.value.push({ id: 1, texto: "Estudar Vue" })  // só isso. A lista aparece sozinha.
```

O template está **amarrado** ao dado. Mudou o dado → a tela muda. Você nunca mais
escreve `createElement`/`appendChild`.

| Tarefa | DOM puro | Vue 3 |
|--------|----------|-------|
| Guardar estado | `let tarefas = []` | `ref([])` |
| Pegar elemento | `querySelector` | (não precisa) |
| Criar item na tela | `createElement` + `appendChild` | `v-for` |
| Mostrar valor | `el.innerText = x` | `{{ x }}` |
| Reagir a clique | `addEventListener` | `@click` |
| Atualizar a tela | redesenhar na mão | **automático** |
| Risco de dessincronizar | alto | ~zero |

> ⚠️ Vue **não é mágica**: por baixo ele ainda mexe no DOM por você — só que de
> forma otimizada (Virtual DOM) e automática. É a automação do que você fazia na mão.

---

## 3. `createApp` — onde tudo começa

`createApp` é a função que **liga o Vue a um pedaço do seu HTML**. Veja
[03-createApp-anatomia.html](03-createApp-anatomia.html) para a versão comentada
linha a linha. Em resumo:

```js
createApp({                  // (A) cria a app a partir de um componente raiz
  setup() {                  // (B) onde mora a lógica reativa
    const tarefas = ref([])
    return { tarefas }       // (C) o que o template pode usar
  }
}).mount("#app")             // (D) "cola" a app no <div id="app">
```

No mundo profissional (com build), esse mesmo `createApp` mora num arquivo
`src/main.js` — veja [projeto-vite-todo/src/main.js](projeto-vite-todo/src/main.js).

---

## 4. As 3 formas de usar Vue

| Forma | Quando | Build? |
|-------|--------|--------|
| **CDN** (`<script src="vue.global.js">`) | aprender, protótipo, 1 arquivo | ❌ |
| **Vite + SFC** (`npm create vue@latest`) | **qualquer projeto real** | ✅ |
| **Nuxt** | SSR/SEO, apps grandes | ✅ |

Os exemplos `02` e `03` usam **CDN** (não precisa instalar nada). O
[projeto-vite-todo/](projeto-vite-todo/) usa **Vite + SFC** — a forma definitiva.

---

## 5. Experimentos para fixar

1. **No `01-dom-puro.html`**: dentro de `adicionarTarefa()`, comente a linha que
   chama `renderizar()`. Adicione uma tarefa. → O array muda, mas a tela congela.
   Esse é exatamente o problema que o Vue resolve.

2. **No `02-vue-cdn.html`**: adicione no template
   `<p>Total: {{ tarefas.length }} tarefa(s)</p>`. → Funciona na hora, sem tocar em
   nenhuma função. No DOM puro você teria que criar o elemento e atualizá-lo dentro
   de `renderizar()`.

3. Compare a **contagem de linhas** dos dois arquivos para o mesmo comportamento.

---

## Próximo passo

➡️ [01-reatividade](../01-reatividade/) — aprofunda `ref`, `computed` e por que o
`.value` existe.
