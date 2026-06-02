# Arquitetura de pastas — Vue 3 + Vite

> O que o `npm create vue@latest` gera e como isso cresce num projeto sério.
> A versão **rodável** dessa estrutura está em [projeto-vite-todo/](projeto-vite-todo/).

---

## A estrutura completa

```
meu-app/
├── index.html            # ÚNICO html da SPA. Tem o <div id="app">. Vite injeta o JS aqui.
├── package.json          # dependências + scripts (dev, build, preview)
├── vite.config.js        # config do Vite + alias "@" → ./src
├── .gitignore            # ignora node_modules/, dist/, .env...
├── public/               # arquivos servidos CRUS (favicon, robots.txt). NÃO passam pelo build.
└── src/                  # 99% do seu código vive aqui
    ├── main.js           # PONTO DE ENTRADA: createApp(App).mount('#app')
    ├── App.vue           # componente RAIZ (layout geral + <RouterView/>)
    ├── assets/           # css, imagens e fontes que PASSAM pelo build (são otimizados)
    ├── components/       # componentes reutilizáveis e "burros" (Botao, Modal, Card)
    ├── views/  (pages/)  # componentes de TELA INTEIRA, um por rota
    ├── router/           # configuração de rotas (Vue Router) — nível 3
    ├── stores/           # estado GLOBAL (Pinia) — nível 3
    ├── composables/      # lógica reutilizável (useFetch, useTarefas) — "hooks" do Vue
    └── services/ (api/)  # chamadas HTTP/persistência, ISOLADAS da interface
```

> 💡 Nem todo projeto tem todas as pastas. No **nível 1** você usa só
> `main.js`, `App.vue`, `components/` e `assets/`. As outras entram conforme o
> roadmap avança (router/stores no nível 3, etc.). Crie pastas **quando a dor
> aparecer**, não antes.

---

## O papel de cada pasta (a régua mental)

| Pasta | Pergunta que ela responde | Exemplo |
|-------|---------------------------|---------|
| `components/` | "uma peça de UI reutilizável" | `BaseButton.vue`, `TarefaItem.vue` |
| `views/` | "uma tela inteira (rota)" | `HomeView.vue`, `LoginView.vue` |
| `composables/` | "lógica reutilizável sem UI" | `useTarefas()`, `useFetch()` |
| `services/` | "como falo com o mundo externo" | `api.js`, `storage.js` |
| `stores/` | "estado que VÁRIAS telas compartilham" | `useCartStore()` |
| `router/` | "qual URL mostra qual view" | `/` → Home, `/sobre` → Sobre |
| `assets/` | "css/imagem que o build otimiza" | `main.css`, `logo.svg` |

### `components/` vs `views/` (a dúvida nº 1)

| | `components/` | `views/` |
|---|---|---|
| Papel | peça reutilizável | uma página |
| Ligado a uma rota? | **não** | **sim** (1 rota → 1 view) |
| Reusado em vários lugares? | sim | normalmente não |
| Exemplo | `TarefaItem.vue` | `HomeView.vue` |

Regra prática: **se aparece numa URL, é uma `view`. Se é uma peça que monta uma view, é um `component`.**

---

## `public/` vs `assets/` (a dúvida nº 2)

| | `public/` | `src/assets/` |
|---|---|---|
| Passa pelo build? | ❌ não | ✅ sim (otimizado, com hash no nome) |
| Como referenciar | caminho absoluto `/favicon.ico` | `import` ou `@/assets/...` |
| Use para | favicon, robots.txt, arquivos fixos | css, imagens e fontes do app |

---

## Duas filosofias de organização

```
LAYER-BASED (por TIPO)            FEATURE-BASED (por FUNCIONALIDADE)
src/                              src/
├── components/                   ├── features/
├── views/                        │   ├── auth/
├── stores/                       │   │   ├── components/
├── composables/                  │   │   ├── LoginView.vue
└── services/                     │   │   ├── auth.store.js
                                  │   │   └── auth.service.js
(tudo do mesmo tipo junto)        │   └── tarefas/
                                  │       ├── components/
                                  │       ├── TarefasView.vue
                                  │       └── useTarefas.js
                                  └── shared/   (componentes/utils comuns)
```

- **Layer-based** (por tipo) → simples, é o padrão do `create vue`. Ótimo para
  projetos pequenos/médios e para aprender. **Comece aqui.**
- **Feature-based** (por domínio) → agrupa tudo de uma funcionalidade junto.
  Escala muito melhor em apps grandes (cada feature é quase um "mini-app").

> 🎯 **Conselho**: comece **layer-based**. Migre para **feature-based** só quando
> uma pasta (ex: `components/`) passar de ~15 arquivos e você começar a se perder
> procurando coisas. Não otimize cedo demais — isso é tema do
> [nível 4](../../nivel-4-typescript-testes/) e [nível 6](../../nivel-6-arquitetura/).

---

## O alias `@`

No `vite.config.js`, `@` aponta para `src/`. Em vez de:

```js
import TarefaItem from '../../../components/TarefaItem.vue'  // 😖 frágil
```

você escreve:

```js
import TarefaItem from '@/components/TarefaItem.vue'         // 😎 absoluto e estável
```

---

## Fluxo de dados (quem chama quem)

```
   router/  ──escolhe──▶  views/  ──usa──▶  components/
                            │                   │
                            └──── chamam ───────┘
                                     │
                            composables/  (lógica reativa)
                                     │
                            services/  (HTTP / localStorage)
                                     │
                            stores/  (estado global, quando precisa)
```

Princípio: **a UI (components/views) não fala HTTP direto**. Ela chama um
`composable` ou `store`, que por sua vez chama um `service`. Isso mantém a
interface "burra" e testável.
