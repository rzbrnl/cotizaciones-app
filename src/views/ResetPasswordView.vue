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
        <h1 class="auth-title">Nueva contraseña</h1>
        <p class="auth-subtitle">Ingresa tu nueva contraseña para tu cuenta.</p>

        <div v-if="error" class="auth-error">{{ error }}</div>
        <div v-if="success" class="auth-success">{{ success }}</div>

        <form v-if="!success" @submit.prevent="handleReset" class="auth-form">
          <div class="auth-field">
            <label>Nueva contraseña</label>
            <input v-model="newPassword" type="password" placeholder="Mínimo 6 caracteres" @input="checkPasswordStrength" />
            <div v-if="newPassword" class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :style="{ width: strengthPercent + '%', background: strengthColor }"></div>
              </div>
              <span class="strength-text" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
            </div>
          </div>
          <div class="auth-field">
            <label>Confirmar contraseña</label>
            <input v-model="confirmPassword" type="password" placeholder="Repite la contraseña" />
          </div>
          <button type="submit" class="auth-submit" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar contraseña' }}
          </button>
        </form>

        <p class="auth-footer"><router-link to="/login">Volver al inicio de sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { supabase } from '../lib/supabase'

const router = useRouter()
const themeStore = useThemeStore()

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const strengthPercent = ref(0)
const strengthLabel = ref('')
const strengthColor = ref('#ccc')

function checkPasswordStrength() {
  const pwd = newPassword.value
  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 1) { strengthPercent.value = 20; strengthLabel.value = 'Débil'; strengthColor.value = '#ef4444' }
  else if (score <= 2) { strengthPercent.value = 40; strengthLabel.value = 'Regular'; strengthColor.value = '#f59e0b' }
  else if (score <= 3) { strengthPercent.value = 60; strengthLabel.value = 'Buena'; strengthColor.value = '#f59e0b' }
  else if (score <= 4) { strengthPercent.value = 80; strengthLabel.value = 'Fuerte'; strengthColor.value = '#22c55e' }
  else { strengthPercent.value = 100; strengthLabel.value = 'Muy fuerte'; strengthColor.value = '#22c55e' }
}

onMounted(async () => {
  // Supabase handles the token automatically when user clicks the reset link
  // We just need to check if there's an active session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    error.value = 'Sesión no válida. Solicita un nuevo enlace de recuperación.'
  }
})

async function handleReset() {
  error.value = ''
  success.value = ''

  if (!newPassword.value || !confirmPassword.value) {
    error.value = 'Completa ambos campos'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword.value })
  loading.value = false

  if (updateError) {
    error.value = 'Error al actualizar la contraseña'
  } else {
    success.value = 'Contraseña actualizada correctamente'
    setTimeout(() => router.push('/login'), 2000)
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
</style>