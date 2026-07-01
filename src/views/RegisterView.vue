<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">CotizaYa by Vēlum</h1>
      <p class="auth-subtitle">Comienza a crear cotizaciones profesionales, organiza a tus clientes y comparte propuestas en minutos.</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="auth-field">
          <label>Nombre completo</label>
          <input v-model="fullName" type="text" placeholder="Tu nombre completo" autofocus />
        </div>
        <div class="auth-field">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" placeholder="hola@mundo.com" />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Tu contraseña" />
        </div>
        <div class="auth-field">
          <label>Confirmar contraseña</label>
          <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" />
        </div>
        <div v-if="error" class="auth-error">{{ error }}</div>
        <div v-if="success" class="auth-success">{{ success }}</div>
        <button type="submit" class="auth-submit" :disabled="loading">
          {{ loading ? 'Creando...' : 'Registrarme' }}
        </button>
      </form>

      <p class="auth-footer">¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''

  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Completa todos los campos'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (password.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  loading.value = true
  const result = await auth.register(email.value, password.value, fullName.value)
  loading.value = false

  if (result.success) {
    success.value = 'Cuenta creada. Revisa tu email para confirmar tu cuenta.'
    setTimeout(() => router.push('/'), 2000)
  } else {
    error.value = result.error
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #353535;
  padding: 20px;
}

.auth-card {
  background: var(--white);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px 40px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.25);
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--black);
  text-align: center;
  margin-bottom: 8px;
}

.auth-subtitle {
  font-size: 0.85rem;
  color: var(--gray-text);
  text-align: center;
  line-height: 1.5;
  margin-bottom: 32px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.auth-field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--black);
}

.auth-field input {
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  background: #fafafa;
}

.auth-field input:focus {
  border-color: var(--gold);
  background: var(--white);
}

.auth-field input::placeholder {
  color: #bbb;
}

.auth-error {
  background: #fef2f2;
  color: var(--danger);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  text-align: center;
}

.auth-success {
  background: #f0fdf4;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  text-align: center;
}

.auth-submit {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.auth-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.auth-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 0.85rem;
  color: var(--gray-text);
}

.auth-footer a {
  color: var(--gold);
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
