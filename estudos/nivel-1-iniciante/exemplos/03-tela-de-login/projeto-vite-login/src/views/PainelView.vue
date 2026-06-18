<script setup>
// VIEW da rota "/" — PÁGINA PROTEGIDA.
// O guard no router/index.js garante que só chega aqui quem está logado,
// então podemos confiar que `usuario` existe.
import { useAuth } from '@/composables/useAuth'

const { usuario } = useAuth()
</script>

<template>
  <section>
    <h2>Painel</h2>
    <p>Você está autenticado. 🎉</p>

    <ul class="dados">
      <li><strong>Nome:</strong> {{ usuario.nome }}</li>
      <li><strong>E-mail:</strong> {{ usuario.email }}</li>
      <li><strong>ID:</strong> {{ usuario.id }}</li>
    </ul>

    <p class="nota">
      Esta rota é protegida. Teste: clique em <strong>Sair</strong> e tente abrir
      <code>/</code> de novo — o guard te redireciona para <code>/login</code>.
      Já logado, dê <code>F5</code>: você continua dentro (graças ao
      <code>localStorage</code>).
    </p>
  </section>
</template>

<style scoped>
h2 { margin-top: 0; }
.dados { list-style: none; padding: 0; }
.dados li { padding: 6px 0; border-bottom: 1px solid #eee; }
.nota {
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--cinza);
}
code { background: #f3f3f3; padding: 1px 5px; border-radius: 4px; }
</style>
