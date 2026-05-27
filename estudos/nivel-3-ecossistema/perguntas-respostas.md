# Nível 3 — Perguntas e Respostas

---

### 1. `createWebHistory` vs `createWebHashHistory`?

<details>
<summary>Resposta</summary>

- `createWebHistory()`: URLs limpas (`/users/42`). **Requer config no servidor** para devolver `index.html` em qualquer rota (senão F5 dá 404).
- `createWebHashHistory()`: URLs com `#` (`/#/users/42`). Não precisa config no servidor. Útil em hospedagem estática simples.
- `createMemoryHistory()`: sem URL — para testes ou SSR.

Em produção real, use `createWebHistory` e configure o servidor (Nginx/Apache/Netlify/Vercel todos têm um setting para isso).
</details>

---

### 2. Por que usar `storeToRefs` ao destruturar uma store Pinia?

<details>
<summary>Resposta</summary>

Estado da store é reativo. Ao destruturar diretamente, você quebra a reatividade dos valores primitivos.

```js
const auth = useAuthStore()

// ERRADO — perde reatividade
const { user, isLoggedIn } = auth

// CERTO — usa storeToRefs para state e getters
const { user, isLoggedIn } = storeToRefs(auth)

// Funções (actions) podem ser destruturadas normalmente
const { login, logout } = auth
```
</details>

---

### 3. Quando usar `meta` em rotas?

<details>
<summary>Resposta</summary>

Para anexar metadados custom à rota — bandeiras lidas pelos guards ou layout:

```js
{ path: '/admin', meta: { requiresAuth: true, role: 'admin' } }
{ path: '/login', meta: { layout: 'blank' } }
```

```js
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !user.value) return '/login'
})
```

```vue
<component :is="layouts[$route.meta.layout || 'default']">
  <RouterView />
</component>
```
</details>

---

### 4. Como passar dados entre rotas?

<details>
<summary>Resposta</summary>

Três caminhos, em ordem de preferência:

1. **Params** (`/users/:id`) — fazem parte da URL, são bookmarkable.
2. **Query** (`?search=foo`) — para filtros opcionais.
3. **Store Pinia** — para dados que não cabem na URL (objetos grandes).

Não use `state` ou `params` do Vue Router para passar objetos — eles somem em refresh.
</details>

---

### 5. Por que lazy load de rotas?

<details>
<summary>Resposta</summary>

Divide o bundle em chunks menores que carregam **sob demanda**, melhorando o tempo de carregamento inicial.

```js
// Eager (vai no bundle principal)
import Users from '@/views/Users.vue'
{ path: '/users', component: Users }

// Lazy (chunk separado, carrega ao acessar)
{ path: '/users', component: () => import('@/views/Users.vue') }
```

Especialmente importante em apps grandes — usuário não baixa código de páginas que nunca visita.
</details>

---

### 6. Pinia vs Vuex — por que migrar?

<details>
<summary>Resposta</summary>

- API mais simples (sem mutations, sem modules).
- Suporte nativo a TypeScript.
- Tree-shakable (chunks menores).
- Múltiplas stores compostas, sem nesting forçado.
- DevTools melhores.

Vuex 4 ainda funciona, mas Pinia é **a recomendação oficial** do Vue desde 2022.
</details>

---

### 7. Quando usar `action` vs `mutation` no Pinia?

<details>
<summary>Resposta</summary>

**Pegadinha**: Pinia **não tem mutations**. Você muta o state diretamente dentro de actions (ou até de componentes, embora não seja boa prática).

```js
export const useCart = defineStore('cart', () => {
  const items = ref([])

  function add(item) {
    items.value.push(item)  // mutação direta — OK
  }

  return { items, add }
})
```

Para mutações em lote, use `store.$patch`:
```js
cart.$patch({ items: [], total: 0 })
```
</details>

---

### 8. Como compartilhar lógica entre stores?

<details>
<summary>Resposta</summary>

Uma store pode importar e usar outra:

```js
import { useAuthStore } from './auth'

export const useCart = defineStore('cart', () => {
  const auth = useAuthStore()  // chame DENTRO do setup

  function checkout() {
    if (!auth.isLoggedIn) throw new Error('Faça login')
    // ...
  }

  return { checkout }
})
```

**Não** chame `useOutraStore()` no top-level do arquivo — só dentro do setup. Pinia precisa estar inicializado.
</details>

---

### 9. Por que usar uma instância axios e não `axios` direto?

<details>
<summary>Resposta</summary>

Instância permite **configuração centralizada**: baseURL, headers default, interceptors, timeout.

```js
export const http = axios.create({ baseURL: '/api', timeout: 10000 })
http.interceptors.request.use(addAuthToken)
http.interceptors.response.use(null, handleErrors)
```

Sem isso, você repete `Authorization: Bearer ${token}` em cada chamada e não tem como tratar 401 globalmente.
</details>

---

### 10. Como evitar race conditions em fetch dentro de watch?

<details>
<summary>Resposta</summary>

Use `AbortController` para cancelar requisições obsoletas.

```js
let controller
watch(searchTerm, async (term) => {
  controller?.abort()
  controller = new AbortController()

  try {
    const res = await fetch(`/search?q=${term}`, { signal: controller.signal })
    results.value = await res.json()
  } catch (e) {
    if (e.name !== 'AbortError') throw e
  }
})
```

Sem isso, requests lentos podem chegar depois de requests rápidos e sobrescrever resultados corretos.
</details>

---

### 11. Quando usar VeeValidate vs validação manual?

<details>
<summary>Resposta</summary>

- **Manual**: formulários simples (1-3 campos), regras únicas.
- **VeeValidate**: formulários complexos, validação async, integração com schema (Zod/Yup), múltiplos campos com regras compartilhadas.

VeeValidate elimina muito boilerplate (touched state, dirty state, mensagens, foco automático no erro).
</details>

---

### 12. Como tratar erros de API de forma centralizada?

<details>
<summary>Resposta</summary>

Em três camadas:

1. **Interceptor axios** — captura erros HTTP (401, 403, 500) e dispara ações globais (logout, toast).
2. **Try/catch em actions Pinia** — atualiza estado de erro e re-lança se quiser.
3. **Try/catch no componente** — última linha de defesa, mostra mensagem para o usuário.

```js
// interceptor — sempre converte para Error com mensagem amigável
http.interceptors.response.use(null, (err) => {
  const message = err.response?.data?.message || 'Erro de conexão'
  toast.error(message)
  return Promise.reject({ ...err, message })
})
```
</details>
