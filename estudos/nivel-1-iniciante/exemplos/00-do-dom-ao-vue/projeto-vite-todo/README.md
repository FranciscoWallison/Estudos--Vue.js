# projeto-vite-todo

O mesmo To-Do dos HTMLs do exemplo [00-do-dom-ao-vue](../), agora como um
**projeto Vite real** — para você ver a [arquitetura de pastas](../ARQUITETURA.md)
funcionando de verdade.

## Como rodar

```bash
cd projeto-vite-todo
npm install     # instala dependências (cria node_modules/) — só na 1ª vez
npm run dev     # sobe o servidor em http://localhost:5173
```

Outros scripts:

```bash
npm run build     # gera a pasta dist/ otimizada para produção
npm run preview   # serve a dist/ localmente para conferir o build
```

> Precisa de **Node 20+**. Veja [FERRAMENTAS.md](../FERRAMENTAS.md) para entender
> cada ferramenta.

## Estrutura

```
projeto-vite-todo/
├── index.html              # único HTML, com <div id="app">
├── package.json            # dependências + scripts
├── vite.config.js          # config + alias "@" → ./src
├── public/favicon.svg      # arquivo servido cru (não passa pelo build)
└── src/
    ├── main.js             # createApp(App).use(router).mount('#app')  ← entrada
    ├── App.vue             # raiz: layout + menu + <RouterView/>
    ├── assets/main.css     # css global (passa pelo build)
    ├── router/index.js     # rotas: / → Home, /sobre → Sobre (lazy)
    ├── views/
    │   ├── HomeView.vue    # tela das tarefas (orquestra tudo)
    │   └── SobreView.vue   # tela "sobre" (carregada lazy)
    ├── components/
    │   ├── TarefaForm.vue  # input + botão; emite 'adicionar'
    │   └── TarefaItem.vue  # uma tarefa; recebe props, emite eventos
    ├── composables/
    │   └── useTarefas.js   # estado reativo + ações + persistência
    └── services/
        └── storage.js      # localStorage (trocável por API sem mexer na UI)
```

## Fluxo de dados (quem chama quem)

```
HomeView (view)
   │  usa
   ▼
useTarefas() (composable)  ──► storage.js (service) ──► localStorage
   │  fornece estado + ações
   ▼
TarefaForm / TarefaItem (components)
   props descem ▼     ▲ eventos sobem
```

**Princípio**: a UI (`views`/`components`) nunca fala com o `localStorage`
direto — ela passa pelo `composable`, que passa pelo `service`. Trocar o
armazenamento por uma API REST = mexer só em `services/storage.js`.

## O que praticar aqui

1. Adicione um botão **"Limpar concluídas"** (nova ação no composable + botão na view).
2. Crie um `computed` `pendentes` e mostre na Home.
3. Troque o `localStorage` por uma API fake (ex: JSONPlaceholder) mexendo **só**
   em `services/storage.js` — sinta o poder de ter isolado essa camada.
