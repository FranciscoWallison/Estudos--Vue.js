<script setup>
// VIEW da rota "/login". ORQUESTRA: junta o componente de formulário
// (LoginForm) com o cérebro de autenticação (useAuth) e a navegação (router).
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logar } = useAuth()

const carregando = ref(false)
const erro = ref('')

// chamado quando o LoginForm emite 'enviar'
async function aoEnviar({ email, senha }) {
  carregando.value = true
  erro.value = ''
  try {
    await logar(email, senha)          // fala com o service mockado
    router.push({ name: 'painel' })    // sucesso → vai para a rota protegida
  } catch (e) {
    erro.value = e.message             // falha → mostra a mensagem no form
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <section>
    <h2>Entrar</h2>

    <!-- props descem (:carregando/:erro), evento sobe (@enviar) -->
    <LoginForm :carregando="carregando" :erro="erro" @enviar="aoEnviar" />

    <p class="dica">
      🔑 Para testar: <strong>admin@vue.com</strong> / <strong>123456</strong>
    </p>
  </section>
</template>

<style scoped>
h2 { margin-top: 0; }
.dica {
  margin-top: 16px;
  font-size: 0.85rem;
  color: var(--cinza);
  background: #f6f6f6;
  border-radius: 6px;
  padding: 8px 10px;
}
</style>
