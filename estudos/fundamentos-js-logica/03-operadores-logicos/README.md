# 03 — Operadores Lógicos

Operadores lógicos combinam ou invertem condições. São o coração de todo `if`, `v-if` e `computed`. No JavaScript eles têm um superpoder a mais: o **curto-circuito**, que vai além de só "verdadeiro/falso".

## Os três básicos

| Operador | Nome | Lê-se | Resultado verdadeiro quando... |
|----------|------|-------|--------------------------------|
| `&&` | E (AND) | "e" | **ambos** os lados são verdadeiros |
| `\|\|` | OU (OR) | "ou" | **pelo menos um** lado é verdadeiro |
| `!` | NÃO (NOT) | "não" | inverte: vira o oposto |

### Tabela verdade

```js
// && (E) — só é true se OS DOIS forem true
true  && true   // true
true  && false  // false
false && true   // false
false && false  // false

// || (OU) — é true se PELO MENOS UM for true
true  || true   // true
true  || false  // true
false || true   // true
false || false  // false

// ! (NÃO) — inverte
!true   // false
!false  // true
```

### Exemplo prático

```js
const idade = 25;
const temCarteira = true;

if (idade >= 18 && temCarteira) {
  console.log("Pode dirigir 🚗");
}

const fimDeSemana = false;
const feriado = true;

if (fimDeSemana || feriado) {
  console.log("Dia de descanso 🏖️");
}
```

---

## Truthy e Falsy (a base de tudo)

No JavaScript, qualquer valor pode ser tratado como verdadeiro ou falso num contexto booleano. Existem só **8 valores falsy** — decore-os, todo o resto é truthy:

```js
// FALSY (são tratados como false):
false
0
-0
0n        // BigInt zero
""        // string vazia
null
undefined
NaN

// TRUTHY (tudo o mais), incluindo estes que pegam gente:
"0"       // string com zero → truthy!
"false"   // string com texto → truthy!
[]        // array vazio → truthy!
{}        // objeto vazio → truthy!
```

```js
if ("") console.log("não roda");     // "" é falsy
if ([]) console.log("RODA!");        // [] é truthy (surpresa!)
```

> ⚠️ Pegadinha clássica: `[]` e `{}` são **truthy**. Para checar array vazio, use `arr.length === 0`.

---

## Curto-circuito: o superpoder do JS

Aqui o JS vai além de booleanos. `&&` e `||` **não devolvem `true`/`false`** — eles devolvem **um dos operandos**, e param de avaliar assim que a resposta já está decidida.

### `||` devolve o primeiro valor **truthy**

```js
"" || "padrão"            // "padrão" (o primeiro era falsy)
"Ana" || "padrão"         // "Ana"    (já achou truthy, nem olha o resto)
0 || null || "achou"      // "achou"
```

Uso clássico — **valor padrão**:

```js
function saudar(nome) {
  const nomeFinal = nome || "Visitante"; // se nome for falsy, usa "Visitante"
  return `Olá, ${nomeFinal}!`;
}
saudar("");      // "Olá, Visitante!"
saudar("Ana");   // "Olá, Ana!"
```

### `&&` devolve o primeiro valor **falsy** (ou o último, se todos truthy)

```js
"Ana" && "Bia"    // "Bia"  (passou pelo primeiro truthy, devolve o segundo)
"" && "Bia"       // ""     (parou no primeiro falsy)
```

Uso clássico — **executar só se a condição for verdadeira** (guard):

```js
const usuario = { nome: "Ana" };
usuario && console.log(usuario.nome); // só chama console.log se usuario existir
```

> 💡 É exatamente esse padrão que aparece em templates React/JSX (`{user && <p>...</p>}`). No Vue você usa `v-if`, mas a ideia de curto-circuito é a mesma.

### Por que se chama "curto-circuito"?

Porque o JS **para de avaliar** assim que o resultado é certo:
- `false && qualquerCoisa()` → nem chama `qualquerCoisa()` (o resultado já é `false`).
- `true || qualquerCoisa()` → nem chama `qualquerCoisa()` (o resultado já é `true`).

```js
function efeito() { console.log("rodei!"); return true; }

false && efeito(); // "rodei!" NÃO aparece — curto-circuitou
true  || efeito(); // "rodei!" NÃO aparece — curto-circuitou
```

---

## Os modernos: `??` e `?.`

### `??` — Nullish Coalescing ("ou, mas só para null/undefined")

Parecido com `||`, mas só usa o lado direito se o esquerdo for `null` ou `undefined` — **não** para outros falsy como `0` ou `""`.

```js
0 || 10     // 10  → || acha 0 falsy e troca (às vezes indesejado!)
0 ?? 10     // 0   → ?? só troca null/undefined, então mantém o 0

"" || "x"   // "x"
"" ?? "x"   // ""  → mantém a string vazia
```

Use `??` quando `0`, `""` ou `false` são valores **válidos** que você quer manter:

```js
const config = { volume: 0 };
const volume = config.volume ?? 50; // 0 (correto!)
// se usasse ||, viraria 50 por engano, pois 0 é falsy
```

### `?.` — Optional Chaining ("acessa com segurança")

Acessa propriedades sem dar erro se o objeto do caminho for `null`/`undefined`.

```js
const usuario = { perfil: { nome: "Ana" } };

usuario.perfil.nome     // "Ana"
usuario.endereco.rua    // 💥 TypeError: Cannot read properties of undefined
usuario.endereco?.rua   // undefined (sem erro!) — parou com segurança
```

Combina lindamente com `??`:

```js
const cidade = usuario.endereco?.cidade ?? "Não informada";
```

---

## Precedência (ordem de avaliação)

`!` roda primeiro, depois `&&`, depois `||`. Na dúvida, **use parênteses** — deixa claro e evita bugs.

```js
true || false && false   // true  → && roda antes: (true || (false && false))
(true || false) && false // false → parênteses forçam a ordem
```

---

## Onde isso aparece no Vue

Operadores lógicos estão por todo lado no Vue:

```vue
<template>
  <!-- v-if com && para combinar condições -->
  <button v-if="logado && !carregando">Salvar</button>

  <!-- || para texto padrão -->
  <h1>{{ titulo || 'Sem título' }}</h1>

  <!-- ?. + ?? para acessar dados que podem não ter chegado da API -->
  <p>Cidade: {{ usuario?.endereco?.cidade ?? 'Carregando...' }}</p>

  <!-- ! para alternar / inverter estado -->
  <button @click="aberto = !aberto">Alternar menu</button>
</template>

<script setup>
import { ref } from 'vue';
const logado = ref(true);
const carregando = ref(false);
const titulo = ref('');
const usuario = ref(null);
const aberto = ref(false);
</script>
```

> 🎯 O `aberto = !aberto` é o jeito padrão de criar um botão "liga/desliga" no Vue. Você vai usar isso o tempo todo.

## Próximos passos

- Responda o [questionário](perguntas-respostas.md).
- Resolva os [desafios](desafios.md).
- Com os 3 temas dominados, você tem a base lógica para mandar bem no Vue. 🚀
