# Nível 4 — Desafios

## Desafio 4.1 — Migrar para TypeScript
Pegue o Dashboard do desafio 3.6 e migre 100% para TypeScript.

**Critérios:**
- `lang="ts"` em todos os SFCs.
- Tipos para Props, Emits e refs.
- Tipos para stores Pinia (state, getters, actions).
- Tipos para responses de API (DTOs em `src/types/`).
- `tsc --noEmit` passa sem erros.
- Zero `any` (exceto em pontos justificados com `// eslint-disable`).

## Desafio 4.2 — Testes unitários de composables
Escreva testes para 3 composables criados antes (`useFetch`, `useLocalStorage`, `useCounter`).

**Critérios:**
- Cobertura mínima de 90% nos composables.
- Use `vi.fn()` para mockar fetch.
- Use `vi.useFakeTimers()` para testar debounces e timers.
- Cada composable tem pelo menos 5 testes (happy path, error, edge cases).

## Desafio 4.3 — Testes de componentes
Escreva testes para o `<DataTable>` do desafio 2.3.

**Critérios:**
- Renderiza colunas corretamente a partir das props.
- Renderiza linhas e células.
- Emite `sort` ao clicar no header.
- Mostra slot `empty` quando rows é vazio.
- Aplica scoped slot customizado.
- Use `mount` + `find` + `trigger` + `emitted`.

## Desafio 4.4 — Mocking com MSW
Adicione MSW aos testes do CRUD do desafio 3.4.

**Critérios:**
- Server MSW iniciado em `beforeAll`, fechado em `afterAll`.
- Handlers para GET, POST, PUT, DELETE.
- Teste de erro: handler retorna 500, verificar mensagem de erro na UI.
- Teste de loading: assert que skeleton aparece.

## Desafio 4.5 — Teste E2E com Playwright
Implemente E2E para o fluxo de auth do dashboard.

**Critérios:**
- Cenário 1: login com credenciais válidas → dashboard.
- Cenário 2: login com credenciais inválidas → erro.
- Cenário 3: acessar `/admin` sem login → redireciona para `/login?redirect=/admin`.
- Cenário 4: logout → redireciona para `/login`.
- Use fixtures para limpar localStorage entre testes.

## Desafio 4.6 — Pipeline de qualidade
Configure ESLint, Prettier, Husky, lint-staged e commitlint no projeto.

**Critérios:**
- `npm run lint` falha em código com erros e não tipado.
- `npm run format` formata tudo.
- Commit é bloqueado se lint falhar.
- Mensagem de commit fora do padrão Conventional é rejeitada.
- README documenta como rodar cada comando.

## Desafio 4.7 — CI com GitHub Actions
Crie `.github/workflows/ci.yml` que roda em todo PR.

**Critérios:**
- Job 1: install + lint.
- Job 2: install + type-check (`tsc --noEmit`).
- Job 3: install + test (`vitest run --coverage`).
- Job 4: install + build (`vite build`).
- Falha do CI bloqueia merge.
- Badge no README.

## Desafio 4.8 — i18n
Adicione suporte a PT-BR e EN no dashboard.

**Critérios:**
- Strings extraídas para arquivos `locales/pt-BR.json` e `locales/en.json`.
- Selector de idioma no header.
- Idioma persistido no localStorage.
- Locale dinâmica (lazy load) — não vai tudo no bundle inicial.
- Formatação de data e número também internacionalizada (`d` e `n` do vue-i18n).
