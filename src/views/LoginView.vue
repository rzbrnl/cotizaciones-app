<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">CC</div>
        <h1>Cotizaciones</h1>
        <p>Cristian Castelo — Diseño Floral</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="auth-field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" autofocus />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Tu contraseña" />
        </div>
        <div v-if="error" class="auth-error">{{ error }}</div>
        <button type="submit" class="auth-submit" :disabled="loading">
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>¿No tienes cuenta? <a href="#" @click.prevent="$router.push('/registro')">Crear cuenta</a></p>
      </div>
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 20px;
}

.auth-card {
  background: var(--white);
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 40px 36px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--black);
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.auth-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.auth-header p {
  font-size: 0.8rem;
  color: var(--gray-text);
  letter-spacing: 1px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
}

.auth-field input {
  padding: 12px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.auth-field input:focus {
  border-color: var(--gold);
}

.auth-error {
  background: #fee;
  color: var(--danger);
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  text-align: center;
}

.auth-submit {
  background: var(--gold);
  color: var(--black);
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}

.auth-submit:hover:not(:disabled) {
  background: var(--gold-hover);
}

.auth-submit:disabled {
  opacity: 0.6;
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
