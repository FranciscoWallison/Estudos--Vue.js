// ────────────────────────────────────────────────────────────────
//  ROUTER — mapeia cada URL para uma VIEW.
//  (Vue Router é tema do nível 3; aqui aparece só para dar sentido
//   à pasta views/ e mostrar a arquitetura completa.)
// ────────────────────────────────────────────────────────────────
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // importado direto (carrega já no início)
    },
    {
      path: '/sobre',
      name: 'sobre',
      // lazy loading: a view só é baixada quando o usuário visita /sobre.
      // Isso divide o bundle e acelera o primeiro carregamento.
      component: () => import('@/views/SobreView.vue'),
    },
  ],
})

export default router
