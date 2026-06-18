// ────────────────────────────────────────────────────────────────
//  ROUTER — mapeia cada URL para uma VIEW, e PROTEGE rotas.
//  (Vue Router aprofunda no nível 3; aqui mostramos o essencial:
//   rotas + um "guard" de autenticação.)
// ────────────────────────────────────────────────────────────────
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'painel',
      // lazy loading: a view só é baixada quando necessária
      component: () => import('@/views/PainelView.vue'),
      meta: { requerAuth: true }, // marca esta rota como protegida
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

// GUARD GLOBAL: roda ANTES de cada navegação e pode redirecionar.
// Retornar um objeto de rota = "vá para lá em vez disso".
router.beforeEach((to) => {
  const { isAutenticado } = useAuth()

  // 1) tentou abrir uma rota protegida sem estar logado → manda pro login
  if (to.meta.requerAuth && !isAutenticado.value) {
    return { name: 'login' }
  }

  // 2) já logado tentando ver o /login → manda direto pro painel
  if (to.name === 'login' && isAutenticado.value) {
    return { name: 'painel' }
  }

  // 3) caso contrário, deixa seguir (não retorna nada)
})

export default router
