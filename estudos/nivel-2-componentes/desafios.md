# Nível 2 — Desafios

## Desafio 2.1 — `<BaseButton>` reutilizável
Componente de botão com variantes (`primary`, `secondary`, `danger`) e tamanhos (`sm`, `md`, `lg`).

**Critérios:**
- Props: `variant`, `size`, `disabled`, `loading`.
- Validação com `validator` para variant e size.
- Slot default para o texto.
- Quando `loading`, mostra spinner e fica `disabled`.
- Emite `@click` só quando não está disabled/loading.

## Desafio 2.2 — `<Modal>` com slots
Modal genérico que pode ser aberto/fechado via prop.

**Critérios:**
- `v-model:open` para controle.
- Slots: `header`, `default`, `footer`.
- `<Teleport to="body">` para escapar do z-index pai.
- Fecha ao clicar no backdrop ou apertar `Esc`.
- Bloqueia scroll do body quando aberto.
- Transição suave de entrada/saída.

## Desafio 2.3 — `<DataTable>` com scoped slots
Tabela genérica que recebe colunas e linhas, permitindo renderização customizada por coluna.

**Critérios:**
- Props: `columns` (array de `{ key, label }`), `rows` (array de objetos).
- Scoped slot por coluna: `<template #cell-status="{ value, row }">`.
- Slot `empty` para quando `rows` é vazio.
- Ordenação ao clicar no header (asc/desc/none).
- Linha em loading com skeleton (slot `loading`).

## Desafio 2.4 — Composable `useFetch`
Composable que encapsula `fetch` com loading/error/data.

```js
const { data, error, loading, refetch } = useFetch('/api/users')
```

**Critérios:**
- Aceita URL como string ou `Ref<string>` (reativa — refetch automático ao mudar).
- Cancela request anterior se URL mudar (use `AbortController`).
- Suporta options (method, body, headers).
- Tem `refetch()`.
- Testar com [JSONPlaceholder](https://jsonplaceholder.typicode.com).

## Desafio 2.5 — Composable `useLocalStorage`
Hook que sincroniza um `ref` com o `localStorage`.

```js
const theme = useLocalStorage('theme', 'light')
theme.value = 'dark'  // salva automaticamente no localStorage
```

**Critérios:**
- Lê o valor inicial do localStorage se existir.
- `watch` no ref → salva no localStorage.
- Suporta objetos (JSON).
- Função `remove()` que limpa o ref e o storage.

## Desafio 2.6 — Sistema de Tabs
Componentes `<Tabs>` + `<TabItem>` com API declarativa:

```vue
<Tabs v-model="activeTab">
  <TabItem name="info" label="Informações">Conteúdo 1</TabItem>
  <TabItem name="pedidos" label="Pedidos">Conteúdo 2</TabItem>
</Tabs>
```

**Critérios:**
- `Tabs` descobre filhos via `useSlots()` ou provide/inject.
- Tab ativa destacada visualmente.
- Suporte a teclas ← → para navegar.
- `<KeepAlive>` mantém estado dos painéis ao trocar.
- Aria roles corretos (`tablist`, `tab`, `tabpanel`).

## Desafio 2.7 — Toaster global (Provide/Inject)
Sistema de notificações chamado de qualquer componente.

```js
const toast = useToast()
toast.success('Salvo!')
toast.error('Falhou', { duration: 5000 })
```

**Critérios:**
- Plugin Vue (`app.use(ToastPlugin)`) que registra um `<ToastContainer>` no body.
- 4 tipos: success, error, warning, info.
- Cada toast tem duração configurável e fecha automaticamente.
- Fila de toasts com animação de entrada/saída.
- Limite máximo de toasts visíveis (ex: 5).
