<template>
  <div class="auth-page">
    <header class="auth-header">
      <div class="header-content">
        <router-link to="/" class="header-logo">CotizaYa by Vēlum</router-link>
        <nav class="header-nav">
          <button class="theme-toggle-header" @click="themeStore.toggle" :title="themeStore.isDark ? 'Modo claro' : 'Modo oscuro'">
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
          <router-link to="/login" class="header-link-icon" title="Iniciar sesión">
            <HIcon name="login" :size="20" />
          </router-link>
        </nav>
      </div>
    </header>

    <div class="auth-card">
      <div class="auth-card-inner">
        <h1 class="auth-title">Crear cuenta</h1>
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
            <input v-model="password" type="password" placeholder="Tu contraseña" @input="checkPasswordStrength" />
            <div v-if="password" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: strengthPercent + '%', background: strengthColor }"></div>
              </div>
              <span class="strength-text" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
            </div>
          </div>
          <div class="auth-field">
            <label>Confirmar contraseña</label>
            <input v-model="confirmPassword" type="password" placeholder="Repite tu contraseña" />
            <div v-if="confirmPassword && password !== confirmPassword" class="password-mismatch">
              Las contraseñas no coinciden
            </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import HIcon from '../components/HIcon.vue'

const auth = useAuthStore()
const router = useRouter()
const themeStore = useThemeStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const strengthPercent = ref(0)
const strengthLabel = ref('')
const strengthColor = ref('#ccc')

function checkPasswordStrength() {
  const pwd = password.value
  let score = 0

  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) {
    strengthPercent.value = 20
    strengthLabel.value = 'Débil'
    strengthColor.value = '#ef4444'
  } else if (score <= 2) {
    strengthPercent.value = 40
    strengthLabel.value = 'Regular'
    strengthColor.value = '#f59e0b'
  } else if (score <= 3) {
    strengthPercent.value = 60
    strengthLabel.value = 'Buena'
    strengthColor.value = '#f59e0b'
  } else if (score <= 4) {
    strengthPercent.value = 80
    strengthLabel.value = 'Fuerte'
    strengthColor.value = '#22c55e'
  } else {
    strengthPercent.value = 100
    strengthLabel.value = 'Muy fuerte'
    strengthColor.value = '#22c55e'
  }
}

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
    setTimeout(() => router.push('/dashboard'), 2000)
  } else {
    error.value = result.error
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

.header-link {
  font-size: 0.85rem;
  color: var(--gray-text);
  text-decoration: none;
  transition: color 0.2s;
}

.header-link:hover {
  color: var(--black);
}

.header-btn {
  display: inline-block;
  background: var(--black);
  color: var(--white);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.header-btn:hover {
  background: #4a4a4a;
}

.theme-toggle-header {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle-header:hover {
  color: #666;
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

.theme-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: #666;
  background: rgba(0,0,0,0.05);
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

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
}

.password-mismatch {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 4px;
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

@media (max-width: 480px) {
  .auth-header {
    padding: 12px 16px;
  }

  .header-content {
    gap: 8px;
  }

  .header-logo {
    font-size: 0.85rem;
  }

  .header-nav {
    gap: 8px;
  }
}
</style>
