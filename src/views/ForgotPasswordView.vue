<template>
  <div class="auth-page">
    <header class="auth-header">
      <div class="header-content">
        <router-link to="/" class="header-logo">CotizaYa by Vēlum</router-link>
        <nav class="header-nav">
          <button class="theme-toggle" @click="themeStore.toggle" :title="themeStore.isDark ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="themeStore.isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </nav>
      </div>
    </header>

    <div class="auth-card">
      <div class="auth-card-inner">
        <h1 class="auth-title">¿Olvidaste tu contraseña?</h1>
        <p class="auth-subtitle">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>

        <form @submit.prevent="handleReset" class="auth-form">
          <div class="auth-field">
            <label>Correo electrónico</label>
            <input v-model="email" type="email" placeholder="hola@mundo.com" autofocus />
          </div>
          <div v-if="error" class="auth-error">{{ error }}</div>
          <div v-if="success" class="auth-success">{{ success }}</div>
          <button type="submit" class="auth-submit" :disabled="loading">
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </button>
        </form>

        <p class="auth-footer"><router-link to="/login">Volver al inicio de sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const auth = useAuthStore()
const themeStore = useThemeStore()

const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleReset() {
  error.value = ''
  success.value = ''

  if (!email.value) {
    error.value = 'Ingresa tu correo electrónico'
    return
  }

  loading.value = true
  const result = await auth.resetPassword(email.value)
  loading.value = false

  if (result.success) {
    success.value = 'Te enviamos un correo con las instrucciones para restablecer tu contraseña.'
  } else {
    error.value = 'Ocurrió un error. Verifica tu correo e intenta de nuevo.'
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.auth-header {
  padding: 16px 24px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-logo {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  text-decoration: none;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--gray-text);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: var(--black);
  background: rgba(0,0,0,0.05);
}

.auth-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-card-inner {
  background: #f7f7f7;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px 40px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.1);
  position: relative;
}

.auth-title {
  font-size: 1.4rem;
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
  margin-bottom: 28px;
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
  color: #dc2626;
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
  background: var(--gold);
  color: var(--white);
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
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