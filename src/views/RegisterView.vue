<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <div class="auth-logo">CC</div>
        <h1>Crear Cuenta</h1>
        <p>Regístrate para comenzar a cotizar</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="auth-field">
          <label>Nombre completo</label>
          <input v-model="fullName" type="text" placeholder="Tu nombre" autofocus />
        </div>
        <div class="auth-field">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" />
        </div>
        <div class="auth-field">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" />
        </div>
        <div class="auth-field">
          <label>Confirmar contraseña</label>
          <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" />
        </div>
        <div v-if="error" class="auth-error">{{ error }}</div>
        <div v-if="success" class="auth-success">{{ success }}</div>
        <button type="submit" class="auth-submit" :disabled="loading">
          {{ loading ? 'Creando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>¿Ya tienes cuenta? <a href="#" @click.prevent="$router.push('/login')">Iniciar sesión</a></p>
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
  gap: 16px;
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

.auth-success {
  background: #e8f5e9;
  color: #2e7d32;
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
