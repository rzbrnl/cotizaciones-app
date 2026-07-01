<template>
  <AppLayout>
    <div class="profile-page">
      <div class="profile-hero">
        <div class="profile-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <h1>Mi perfil</h1>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Logo de la empresa</h2>

          <div class="logo-upload" @click="triggerUpload">
            <img v-if="auth.userLogo" :src="auth.userLogo" alt="Logo" class="logo-preview" />
            <div v-else class="logo-empty">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span class="logo-empty-text">Clic aquí para subir tu logo</span>
              <span class="logo-empty-hint">PNG, JPG, SVG</span>
            </div>
            <input ref="fileInput" type="file" accept="image/*" hidden @change="handleLogoUpload" />
          </div>
          <p class="logo-hint">Este logo aparecerá en todas tus cotizaciones</p>
        </div>

        <div class="profile-section">
          <h2>Información de la cuenta</h2>
          <div class="account-card">
            <div class="account-row">
              <span class="account-label">Nombre:</span>
              <span class="account-value">{{ auth.profile?.full_name || '—' }}</span>
            </div>
            <div class="account-row">
              <span class="account-label">Usuario:</span>
              <span class="account-value">{{ auth.currentUser?.email }}</span>
            </div>
            <div class="account-row">
              <span class="account-label">Rol:</span>
              <span class="account-value">Administrador</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import AppLayout from '../components/AppLayout.vue'

const auth = useAuthStore()
const fileInput = ref(null)

function triggerUpload() {
  fileInput.value.click()
}

async function handleLogoUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    alert('El logo debe ser menor a 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = async (ev) => {
    await auth.updateLogo(ev.target.result)
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
}

.profile-hero {
  text-align: center;
  margin-bottom: 40px;
}

.profile-icon {
  color: #999;
  margin-bottom: 12px;
}

.profile-hero h1 {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--black);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-section h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 16px;
}

/* Logo upload */
.logo-upload {
  width: 100%;
  max-width: 360px;
  height: 140px;
  border: 2px dashed var(--gray-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-upload:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 106, 0.04);
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.logo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #bbb;
}

.logo-empty-text {
  font-size: 0.85rem;
  color: #999;
}

.logo-empty-hint {
  font-size: 0.75rem;
  color: #ccc;
}

.logo-hint {
  font-size: 0.8rem;
  color: var(--gray-text);
  margin-top: 10px;
}

/* Account card */
.account-card {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 20px 24px;
}

.account-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.account-row:not(:last-child) {
  border-bottom: 1px solid var(--gray-border);
}

.account-label {
  font-size: 0.85rem;
  color: var(--gray-text);
}

.account-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--black);
}
</style>
