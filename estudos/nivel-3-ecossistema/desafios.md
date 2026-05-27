# Nível 3 — Desafios

> A partir deste nível os desafios são **projetos completos**, não componentes isolados.

## Desafio 3.1 — Blog com Vue Router
SPA com rotas: `/`, `/posts`, `/posts/:id`, `/about`, `/404`.

**Critérios:**
- Lazy loading de todas as rotas (`() => import(...)`).
- `<RouterLink>` com classe ativa.
- Rota dinâmica de post busca pelo `:id` em `onMounted` e refaz fetch ao mudar `id` (use `watch` em `route.params.id`).
- Rota wildcard para 404.
- Botão "Voltar" usa `router.back()`.
- Scroll volta ao topo a cada nova rota.

## Desafio 3.2 — Autenticação com guards
Adicione ao Blog: login fake, rota protegida `/admin`.

**Critérios:**
- Tela `/login` com formulário e store Pinia `useAuthStore`.
- `beforeEach` global checa `meta.requiresAuth`.
- Redireciona para `/login?redirect=/admin` se não autenticado.
- Após login, volta para o `redirect` da query.
- Persistir sessão no localStorage.
- Botão de logout em qualquer rota protegida.

## Desafio 3.3 — Carrinho de compras (Pinia)
App de e-commerce simplificado com listagem, detalhe e carrinho.

**Critérios:**
- Store `useProductsStore` com `fetchAll`, `fetchById`.
- Store `useCartStore` com `add`, `remove`, `increment`, `decrement`, `clear`.
- Getters: `total`, `count`, `itemsById`.
- Persistir carrinho no localStorage com `pinia-plugin-persistedstate`.
- Badge no header mostra `count` em tempo real.
- Tela `/checkout` mostra resumo e botão "Finalizar" que limpa carrinho.

## Desafio 3.4 — CRUD completo com Axios
Use [JSONPlaceholder](https://jsonplaceholder.typicode.com) ou um backend próprio para gerenciar posts.

**Critérios:**
- Listagem com paginação (limit/offset).
- Detalhe com edição inline.
- Criar novo post via modal.
- Deletar com confirmação.
- Instância axios centralizada em `services/http.js`.
- Interceptor que adiciona token e trata 401.
- Toast de sucesso/erro em cada ação (reaproveite o do desafio 2.7).

## Desafio 3.5 — Formulário de cadastro com VeeValidate + Zod
Multi-step (3 passos): dados pessoais → endereço → preferências.

**Critérios:**
- Schema Zod por etapa.
- Não permite avançar com erros.
- "Voltar" preserva o que já foi preenchido.
- Resumo no passo final antes de submeter.
- Endereço autocompletado por CEP (use API ViaCEP).
- Submit envia para `/api/users` (pode ser mock).

## Desafio 3.6 — Dashboard administrativo
Aplicação completa juntando tudo: auth + rotas + Pinia + CRUD + formulários.

**Estrutura sugerida:**
```
src/
  views/
    auth/Login.vue
    admin/Dashboard.vue, Users.vue, Products.vue
  layouts/
    DefaultLayout.vue, AdminLayout.vue
  stores/
    auth.js, users.js, products.js
  services/
    http.js, users.js, products.js
  components/
    AppHeader.vue, AppSidebar.vue, DataTable.vue
  composables/
    useFetch.js, useDebounce.js
```

**Critérios mínimos:**
- Login + logout funcionando.
- Sidebar com navegação.
- Tabela com paginação, busca, ordenação.
- Modal de criar/editar.
- Confirmação de delete.
- Tema claro/escuro persistido.
- Loading states e error states em tudo.
- Mensagem de "Sessão expirada" no 401.
