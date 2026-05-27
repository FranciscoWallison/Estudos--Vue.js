# Nível 0 — Perguntas e Respostas

> Tente responder sem olhar. Só expanda a resposta depois.

---

### 1. Qual a diferença entre `let`, `const` e `var`?

<details>
<summary>Resposta</summary>

- `var`: escopo de função, sofre hoisting com valor `undefined`. **Evite.**
- `let`: escopo de bloco (`{}`), pode ser reatribuído.
- `const`: escopo de bloco, **não pode ser reatribuído**. Para objetos/arrays, o conteúdo ainda pode mudar (a referência é que é imutável).

```js
const arr = [1, 2];
arr.push(3);   // OK — mexe no conteúdo
arr = [4];     // ERRO — tenta trocar a referência
```
</details>

---

### 2. O que faz `async/await`?

<details>
<summary>Resposta</summary>

Açúcar sintático sobre `Promise`. Permite escrever código assíncrono de forma sequencial.

```js
// Com Promise
fetch('/api').then(r => r.json()).then(data => console.log(data));

// Com async/await
const r = await fetch('/api');
const data = await r.json();
console.log(data);
```

`await` só pode ser usado dentro de funções marcadas com `async` (ou no top-level de módulos ES).
</details>

---

### 3. Qual a diferença entre `==` e `===`?

<details>
<summary>Resposta</summary>

- `==`: compara com **coerção de tipo** (`0 == '0'` é `true`).
- `===`: compara valor **e tipo** (`0 === '0'` é `false`).

**Use sempre `===`** para evitar bugs.
</details>

---

### 4. O que é o "this léxico" de arrow functions?

<details>
<summary>Resposta</summary>

Arrow functions **não criam o próprio `this`**. Elas herdam o `this` do escopo em que foram definidas.

```js
function Timer() {
  this.seconds = 0;
  setInterval(() => {
    this.seconds++;  // `this` = Timer (porque arrow herda do escopo)
  }, 1000);
}
```

Com `function` normal, `this` dentro de `setInterval` seria o objeto global (ou `undefined` em strict mode).
</details>

---

### 5. O que `map`, `filter` e `reduce` fazem?

<details>
<summary>Resposta</summary>

- `map`: transforma cada elemento → novo array do **mesmo tamanho**.
- `filter`: mantém só os elementos que passam no teste → array **menor ou igual**.
- `reduce`: acumula em um valor único.

```js
[1, 2, 3].map(n => n * 2);          // [2, 4, 6]
[1, 2, 3].filter(n => n > 1);       // [2, 3]
[1, 2, 3].reduce((acc, n) => acc + n, 0);  // 6
```
</details>

---

### 6. Qual a diferença entre `null` e `undefined`?

<details>
<summary>Resposta</summary>

- `undefined`: variável declarada mas sem valor atribuído (default do JS).
- `null`: ausência **intencional** de valor (você escolheu colocar).

```js
let a;           // undefined
let b = null;    // null

typeof a;  // "undefined"
typeof b;  // "object" (bug histórico do JS)
```
</details>

---

### 7. Como funciona o `event loop`?

<details>
<summary>Resposta</summary>

JS é single-threaded. O event loop pega tarefas da **call stack**, e quando a stack está vazia, processa a **task queue** (callbacks de timers, I/O, etc).

Existem duas filas:
- **Microtasks** (Promises): processadas antes das macrotasks.
- **Macrotasks** (setTimeout, eventos DOM).

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// Output: 1, 4, 3, 2
```
</details>

---

### 8. Para que serve o `.gitignore`?

<details>
<summary>Resposta</summary>

Lista arquivos/pastas que o Git deve **ignorar** (não versionar). Típico:

```
node_modules/
.env
dist/
*.log
.DS_Store
```

Evita commitar dependências, segredos e arquivos gerados.
</details>

---

### 9. Diferença entre `dependencies` e `devDependencies`?

<details>
<summary>Resposta</summary>

- `dependencies`: pacotes necessários em **produção** (ex: `vue`, `axios`).
- `devDependencies`: pacotes só para **desenvolvimento** (ex: `vite`, `eslint`, `prettier`).

```bash
npm install vue              # dependency
npm install --save-dev vite  # devDependency
```

No deploy, `npm install --omit=dev` instala só as dependencies.
</details>

---

### 10. O que é Flexbox vs Grid?

<details>
<summary>Resposta</summary>

- **Flexbox**: layout em **uma dimensão** (linha OU coluna). Bom para distribuir itens, alinhar, navbars.
- **Grid**: layout em **duas dimensões** (linhas E colunas). Bom para layouts de página inteiros, dashboards.

Use os dois juntos: Grid para o esqueleto da página, Flex dentro de cada região.
</details>
