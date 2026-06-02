<script setup>
// O componente RAIZ. Costuma conter só o "esqueleto" do layout
// (cabeçalho, menu, rodapé) e um <RouterView /> onde as telas entram.
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="topo">
    <h1>✅ To-Do Vue</h1>
    <nav>
      <!-- RouterLink troca a tela SEM recarregar a página (SPA) -->
      <RouterLink to="/">Tarefas</RouterLink>
      <RouterLink to="/sobre">Sobre</RouterLink>
    </nav>
  </header>

  <main>
    <!-- Aqui dentro o Vue Router renderiza a view da rota atual -->
    <RouterView />
  </main>
</template>

<style scoped>
.topo {
  display: flex;
  align-items: baseline;
  gap: 24px;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
.topo h1 { font-size: 1.3rem; margin: 0; }
nav { display: flex; gap: 16px; }
nav a { text-decoration: none; color: #555; }
nav a.router-link-active { color: #42b883; font-weight: 600; }
</style>
