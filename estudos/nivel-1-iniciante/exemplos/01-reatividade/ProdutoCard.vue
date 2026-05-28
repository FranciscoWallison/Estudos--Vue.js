<!--
  Esta é a forma MODERNA e definitiva de escrever Vue 3: um SFC
  (Single File Component) com <script setup>.

  ⚠️ Este arquivo NÃO roda com duplo-clique. Arquivos .vue precisam
  ser compilados por um bundler (Vite). Para testar de verdade:

    npm create vue@latest meu-projeto
    cd meu-projeto
    npm install
    # copie este componente para src/components/ProdutoCard.vue
    # e use <ProdutoCard /> dentro de App.vue
    npm run dev

  Compare com vue3-cdn.html: é o MESMO código, só que organizado em
  um arquivo dedicado, sem createApp/mount/return manuais.
-->

<script setup>
import { ref, computed } from 'vue'

// ref() cria valores reativos. Vue observa cada um.
const preco = ref(69)
const total = ref(0)

// computed: valor derivado, recalculado automaticamente.
const valorTotal = computed(() => preco.value * total.value)

// Funções comuns. Mudar um .value já dispara a re-renderização.
function adicionar() {
  total.value++
}

function remover() {
  if (total.value > 0) total.value--
}

// Repare: NÃO existe "return". No <script setup> tudo que está no
// topo do script já fica disponível no <template> automaticamente.
</script>

<template>
  <div class="card">
    <p>Bermudas — R$ <span>{{ preco }}</span></p>
    <button @click="adicionar">Adicionar</button>
    <button @click="remover">Remover</button>
    <span>Quantidade: {{ total }}</span>
    <p class="total">Total: R$ {{ valorTotal }}</p>
  </div>
</template>

<!-- scoped = este CSS só afeta ESTE componente, não vaza para o resto -->
<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  max-width: 420px;
  font-family: system-ui, sans-serif;
}
button {
  padding: 6px 14px;
  margin-right: 6px;
  cursor: pointer;
}
.total {
  font-weight: bold;
}
</style>
