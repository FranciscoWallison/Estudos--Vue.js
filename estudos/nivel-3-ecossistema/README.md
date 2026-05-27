# Nível 3 — Ecossistema (Router, Pinia, HTTP, Formulários)

Onde Vue deixa de ser "biblioteca" e vira "framework de aplicação".

## Objetivos

- Configurar e usar **Vue Router 4**.
- Centralizar estado com **Pinia**.
- Validar formulários com **VeeValidate + Zod**.
- Organizar chamadas HTTP com **Axios** (interceptors, instâncias).
- Estruturar uma aplicação real com autenticação e rotas protegidas.

## Vue Router 4

### Setup
```bash
npm install vue-router@4
```

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/users/:id', name: 'user', component: () => import('@/views/User.vue') },
    {
      path: '/admin',
      component: () => import('@/views/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', component: () => import('@/views/AdminDashboard.vue') },
        { path: 'users', component: () => import('@/views/AdminUsers.vue') }
      ]
    },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

```js
// main.js
import router from './router'
app.use(router)
```

### Uso em componentes
```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

console.log(route.params.id)
router.push({ name: 'user', params: { id: 42 } })
</script>

<template>
  <RouterLink to="/about">Sobre</RouterLink>
  <RouterView />
</template>
```

### Guards
```js
router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

## Pinia

### Setup
```bash
npm install pinia
```

```js
// main.js
import { createPinia } from 'pinia'
app.use(createPinia())
```

### Store (composition API style — recomendado)
```js
// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = computed(() => !!user.value)

  async function login(email, password) {
    const res = await api.post('/login', { email, password })
    user.value = res.data.user
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
```

### Uso
```vue
<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user, isLoggedIn } = storeToRefs(auth)  // mantém reatividade
const { login, logout } = auth
</script>
```

**Importante**: ao destruturar, **sempre use `storeToRefs`** para o state. Funções podem ser destruturadas normalmente.

### Persistência
```bash
npm install pinia-plugin-persistedstate
```

```js
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
```

E no store:
```js
export const useAuthStore = defineStore('auth', () => { ... }, {
  persist: true  // salva no localStorage
})
```

## Axios

```bash
npm install axios
```

```js
// src/services/http.js
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

// Adiciona token automaticamente
http.interceptors.request.use((config) => {
  const auth = useAuthStore()
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// Trata 401 globalmente
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore().logout()
      router.push('/login')
    }
    return Promise.reject(err)
  }
)
```

## Formulários com VeeValidate + Zod

```bash
npm install vee-validate @vee-validate/zod zod
```

```vue
<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const schema = toTypedSchema(z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres')
}))

const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-model="email" v-bind="emailAttrs" />
    <span>{{ errors.email }}</span>

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    <span>{{ errors.password }}</span>

    <button type="submit">Entrar</button>
  </form>
</template>
```

## Próximos passos

[Desafios](desafios.md) → [Q&A](perguntas-respostas.md) → [nível 4](../nivel-4-typescript-testes/).
