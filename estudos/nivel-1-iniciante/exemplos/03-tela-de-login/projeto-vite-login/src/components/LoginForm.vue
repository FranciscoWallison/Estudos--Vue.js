<script setup>
// COMPONENTE reutilizável e "burro": cuida só do formulário e da validação.
// Ele NÃO sabe o que é autenticação nem mexe em rota/storage — apenas
// valida os campos e AVISA o pai (emite 'enviar') com email/senha.
// Fluxo clássico: props descem (carregando/erro), eventos sobem (enviar).
import { ref, computed } from 'vue'

// o que o componente RECEBE do pai
defineProps({
  carregando: { type: Boolean, default: false }, // trava o botão durante o "login"
  erro: { type: String, default: '' },           // mensagem vinda do pai (ex: senha errada)
})

// o que ele EMITE para o pai
const emit = defineEmits(['enviar'])

const email = ref('')
const senha = ref('')
const mostrarSenha = ref(false)
const tentouEnviar = ref(false) // só mostra erros de validação após a 1ª tentativa

// validação reativa (recalcula a cada tecla, sem função validar() na mão)
const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const senhaValida = computed(() => senha.value.length >= 6)
const formValido = computed(() => emailValido.value && senhaValida.value)

function enviar() {
  tentouEnviar.value = true
  if (!formValido.value) return
  emit('enviar', { email: email.value, senha: senha.value })
}
</script>

<template>
  <form @submit.prevent="enviar" novalidate>
    <div class="campo">
      <label>E-mail</label>
      <input
        v-model="email"
        type="email"
        :class="{ invalido: tentouEnviar && !emailValido }"
        placeholder="voce@exemplo.com"
      />
      <p class="erro-campo" v-if="tentouEnviar && !emailValido">
        Informe um e-mail válido.
      </p>
    </div>

    <div class="campo">
      <label>Senha</label>
      <div class="senha-linha">
        <!-- :type alterna entre password e text conforme o botão Mostrar -->
        <input
          v-model="senha"
          :type="mostrarSenha ? 'text' : 'password'"
          :class="{ invalido: tentouEnviar && !senhaValida }"
          placeholder="mínimo 6 caracteres"
        />
        <button type="button" @click="mostrarSenha = !mostrarSenha">
          {{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
      <p class="erro-campo" v-if="tentouEnviar && !senhaValida">
        A senha precisa ter ao menos 6 caracteres.
      </p>
    </div>

    <!-- erro vindo do servidor mockado (ex: credenciais inválidas) -->
    <p class="erro-servidor" v-if="erro">{{ erro }}</p>

    <button class="entrar" type="submit" :disabled="!formValido || carregando">
      {{ carregando ? 'Entrando…' : 'Entrar' }}
    </button>
  </form>
</template>

<style scoped>
.campo { margin-bottom: 14px; }
.senha-linha { display: flex; gap: 8px; }
.senha-linha input { flex: 1; }
.erro-servidor {
  color: var(--vermelho);
  background: #fdecea;
  border-radius: 6px;
  padding: 8px;
  font-size: 0.9rem;
}
.entrar {
  width: 100%;
  background: var(--verde);
  color: #fff;
  border-color: var(--verde);
  font-weight: 600;
}
.entrar:hover:not(:disabled) { filter: brightness(0.95); }
</style>
