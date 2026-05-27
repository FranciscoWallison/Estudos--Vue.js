# Nível 1 — Desafios

> Cada desafio é um projeto Vue 3 separado. Crie com `npm create vue@latest`.

## Desafio 1.1 — Contador reativo
Componente único com um número e três botões: `+`, `-`, `reset`.

**Critérios:**
- Estado com `ref`.
- Não permitir número negativo.
- Mostrar "par" ou "ímpar" usando `computed`.
- Botão `reset` desabilitado quando count = 0 (`:disabled`).

## Desafio 1.2 — Lista de compras
Input + botão "Adicionar". Lista de itens. Cada item pode ser marcado como "comprado" (riscado).

**Critérios:**
- Usar `v-for` com `:key` adequada (não use `index`).
- Adicionar com Enter (`@keydown.enter`).
- Botão "Remover" em cada item.
- Contador no rodapé: "X de Y itens comprados".
- Não adicionar item vazio (validação).

## Desafio 1.3 — Cronômetro
Botões: Iniciar, Pausar, Resetar. Mostra tempo no formato `mm:ss`.

**Critérios:**
- Usar `setInterval` dentro de `onMounted` ou ao clicar em Iniciar.
- Limpar o interval em `onUnmounted` (evitar memory leak).
- Tempo formatado via `computed`.
- Cor do display muda a cada 30 segundos (use `class` dinâmica).

## Desafio 1.4 — Formulário de cadastro com `v-model`
Formulário com: nome, email, idade, gênero (radio), aceita newsletter (checkbox), país (select).

**Critérios:**
- Todos os campos com `v-model`.
- Botão "Cadastrar" desabilitado se algum campo obrigatório estiver vazio.
- Ao submeter, mostrar JSON do objeto na tela (`<pre>{{ JSON.stringify(form, null, 2) }}</pre>`).
- Email validado com regex simples.
- Idade aceita só números (`v-model.number`).

## Desafio 1.5 — Galeria com filtro
Carregue um array fixo de produtos (mínimo 10) com `nome`, `preço` e `categoria`. Filtre por categoria via botões.

**Critérios:**
- Array de categorias derivado dinamicamente com `computed` (sem hard-code).
- Botão da categoria ativa tem estilo diferente.
- Mostrar mensagem "Nenhum produto" se filtro retornar vazio.
- Ordenar por preço (asc/desc) com um select.

## Desafio 1.6 — Quiz de perguntas
Mostre uma pergunta por vez com 4 alternativas. Ao clicar, mostra se acertou e avança.

**Critérios:**
- Array de perguntas no estado.
- `v-if` para alternar entre "pergunta" e "tela final".
- Pontuação final mostrada no fim.
- Botão "Recomeçar" volta para a primeira pergunta.
- Tempo total do quiz cronometrado.

## Desafio 1.7 — Consumindo API
Reaproveite o desafio 0.4 (lista de usuários da JSONPlaceholder), mas em Vue.

**Critérios:**
- `fetch` dentro de `onMounted`.
- Estados: `loading`, `error`, `users`.
- Campo de busca filtra com `computed`.
- Botão "Recarregar" refaz a requisição.
- Mostrar quantidade de resultados visíveis.
