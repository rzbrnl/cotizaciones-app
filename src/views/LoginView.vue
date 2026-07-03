<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">CotizaYa by Vēlum</h1>
      <p class="auth-subtitle">Inicia sesión para crear, administrar y compartir cotizaciones profesionales desde un solo lugar.</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="auth-field">
          <label>Correo electrónico</label>
          <input v-model="email" type="email" placeholder="hola@mundo.com" autofocus />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Tu contraseña" />
        </div>
        <div v-if="error" class="auth-error">{{ error }}</div>
        <button type="submit" class="auth-submit" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="auth-footer">¿No tienes cuenta? <router-link to="/registro">Crear cuenta</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Completa todos los campos'
    return
  }
  loading.value = true
  const result = await auth.login(email.value, password.value)
  loading.value = false
  if (result.success) {
    router.push('/')
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
  background: #f0f0f0;
  padding: 20px;
}

.auth-card {
  background: #f7f7f7;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px 40px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
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
  gap: 20px;
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

.auth-submit {
  background: var(--gold);
  color: var(--white);
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}

.auth-submit:hover:not(:disabled) {
  background: #b8944d;
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
