<script setup>
// O componente RAIZ: o "esqueleto" do layout (cabeçalho + área de conteúdo).
// Mostra quem está logado e o botão Sair; o miolo é a view da rota atual.
import { RouterView, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuario, isAutenticado, sair } = useAuth()

function logout() {
  sair()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topo">
    <h1>🔐 Login Vue</h1>

    <!-- Só aparece quando há sessão. Reage sozinho ao logar/sair. -->
    <div v-if="isAutenticado" class="sessao">
      <span>Olá, {{ usuario.nome }}</span>
      <button @click="logout">Sair</button>
    </div>
  </header>

  <main>
    <!-- Aqui o Vue Router renderiza a view da rota atual -->
    <RouterView />
  </main>
</template>

<style scoped>
.topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
.topo h1 { font-size: 1.2rem; margin: 0; }
.sessao { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
</style>
