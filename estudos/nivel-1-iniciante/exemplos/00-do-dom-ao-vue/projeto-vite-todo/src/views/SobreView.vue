<script setup>
// VIEW da rota "/sobre". É carregada de forma lazy (ver router/index.js).
// Não precisa de lógica — só conteúdo estático.
</script>

<template>
  <article>
    <h2>Sobre este projeto</h2>
    <p>
      Mesmo To-Do dos exemplos <code>01-dom-puro.html</code> e
      <code>02-vue-cdn.html</code>, agora como um projeto <strong>Vite</strong> real,
      organizado em pastas.
    </p>

    <h3>Como o código está dividido</h3>
    <ul>
      <li><strong>services/storage.js</strong> — salva/carrega (poderia ser uma API)</li>
      <li><strong>composables/useTarefas.js</strong> — o "cérebro": estado + ações</li>
      <li><strong>components/</strong> — peças de UI reutilizáveis (form e item)</li>
      <li><strong>views/</strong> — telas ligadas a rotas (esta e a Home)</li>
      <li><strong>router/</strong> — diz qual URL mostra qual view</li>
    </ul>

    <p>
      Fluxo: <code>view</code> → usa <code>composable</code> → que usa
      <code>service</code>. A UI nunca fala com o storage direto.
    </p>
  </article>
</template>

<style scoped>
code { background: #f3f3f3; padding: 1px 5px; border-radius: 4px; }
li { margin: 4px 0; }
</style>
