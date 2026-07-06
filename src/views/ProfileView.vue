<template>
  <AppLayout>
    <div class="profile-page">
      <!-- Hero with logo -->
      <div class="profile-hero">
        <div class="profile-avatar" @click="triggerUpload">
          <img v-if="auth.userLogo" :src="auth.userLogo" alt="Logo" class="avatar-logo" />
          <div v-else class="avatar-placeholder">
            <HIcon name="user" :size="32" />
          </div>
          <div class="avatar-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="handleLogoUpload" />
        </div>
        <h1>{{ auth.profile?.full_name || 'Mi perfil' }}</h1>
        <p class="profile-email">{{ auth.currentUser?.email }}</p>
      </div>

      <!-- Tabs -->
      <div class="profile-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span v-html="tab.icon"></span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Cuenta -->
        <div v-if="activeTab === 'cuenta'" class="tab-panel">
          <div class="panel-header">
            <h2>Información de la cuenta</h2>
            <button v-if="!editingProfile" class="edit-btn" @click="startEditProfile">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editar
            </button>
          </div>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Nombre</span>
              <input v-if="editingProfile" v-model="editName" type="text" class="inline-input" />
              <span v-else class="info-value">{{ auth.profile?.full_name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ auth.currentUser?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Rol</span>
              <span class="info-badge" :class="auth.profile?.role === 'admin' ? 'admin' : 'user'">
                {{ auth.profile?.role === 'admin' ? 'Administrador' : 'Usuario' }}
              </span>
            </div>
          </div>
          <div v-if="editingProfile" class="panel-actions">
            <button class="btn-primary" @click="saveProfile" :disabled="savingProfile">
              {{ savingProfile ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="btn-secondary" @click="cancelEditProfile">Cancelar</button>
          </div>
        </div>

        <!-- Datos de pago -->
        <div v-if="activeTab === 'pago'" class="tab-panel">
          <div class="panel-header">
            <h2>Datos de pago</h2>
          </div>
          <p class="panel-hint">Se enviarán al cliente cuando apruebe la cotización</p>
          <div class="form-grid">
            <div class="form-field">
              <label>Banco</label>
              <input v-model="paymentData.bank" type="text" placeholder="BBVA, Banorte..." />
            </div>
            <div class="form-field">
              <label>Titular</label>
              <input v-model="paymentData.holder" type="text" placeholder="Nombre completo" />
            </div>
            <div class="form-field full">
              <label>CLABE</label>
              <input v-model="paymentData.clabe" type="text" placeholder="18 dígitos" maxlength="18" class="mono-input" />
            </div>
            <div class="form-field">
              <label>Cuenta</label>
              <input v-model="paymentData.account" type="text" placeholder="Número de cuenta" class="mono-input" />
            </div>
            <div class="form-field">
              <label>PayPal</label>
              <input v-model="paymentData.paypal" type="email" placeholder="Opcional" />
            </div>
          </div>
          <div class="panel-actions">
            <button class="btn-primary" @click="savePaymentInfo" :disabled="savingPayment">
              {{ savingPayment ? 'Guardando...' : 'Guardar datos de pago' }}
            </button>
          </div>
        </div>

        <!-- Seguridad -->
        <div v-if="activeTab === 'seguridad'" class="tab-panel">
          <div class="panel-header">
            <h2>Cambiar contraseña</h2>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label>Nueva contraseña</label>
              <input v-model="newPassword" type="password" placeholder="Mínimo 6 caracteres" />
            </div>
            <div class="form-field">
              <label>Confirmar contraseña</label>
              <input v-model="confirmPassword" type="password" placeholder="Repite la contraseña" />
            </div>
          </div>
          <div class="panel-actions">
            <button class="btn-primary" @click="handleChangePassword" :disabled="changingPassword">
              {{ changingPassword ? 'Cambiando...' : 'Cambiar contraseña' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import AppLayout from '../components/AppLayout.vue'
import HIcon from '../components/HIcon.vue'

const auth = useAuthStore()
const toast = useToastStore()
const fileInput = ref(null)
const savingPayment = ref(false)
const editingProfile = ref(false)
const savingProfile = ref(false)
const editName = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changingPassword = ref(false)
const activeTab = ref('cuenta')

const tabs = [
  {
    id: 'cuenta',
    label: 'Cuenta',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  },
  {
    id: 'pago',
    label: 'Datos de pago',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>'
  },
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  }
]

const paymentData = reactive({
  bank: '',
  clabe: '',
  account: '',
  holder: '',
  paypal: '',
})

onMounted(() => {
  if (auth.paymentInfo) {
    Object.assign(paymentData, auth.paymentInfo)
  }
})

function startEditProfile() {
  editName.value = auth.profile?.full_name || ''
  editingProfile.value = true
}

function cancelEditProfile() {
  editingProfile.value = false
  editName.value = ''
}

async function saveProfile() {
  if (!editName.value.trim()) {
    toast.error('El nombre no puede estar vacío')
    return
  }
  savingProfile.value = true
  await auth.updateProfile({ full_name: editName.value.trim() })
  savingProfile.value = false
  editingProfile.value = false
  toast.success('Perfil actualizado')
}

function triggerUpload() {
  fileInput.value.click()
}

async function handleLogoUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    toast.error('El logo debe ser menor a 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = async (ev) => {
    await auth.updateLogo(ev.target.result)
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

async function savePaymentInfo() {
  savingPayment.value = true
  await auth.updatePaymentInfo({ ...paymentData })
  savingPayment.value = false
  toast.success('Datos de pago guardados')
}

async function handleChangePassword() {
  if (!newPassword.value || !confirmPassword.value) {
    toast.error('Completa ambos campos')
    return
  }

  if (newPassword.value.length < 6) {
    toast.error('La contraseña debe tener al menos 6 caracteres')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    toast.error('Las contraseñas no coinciden')
    return
  }

  changingPassword.value = true
  const result = await auth.changePassword(newPassword.value)
  changingPassword.value = false

  if (result.success) {
    newPassword.value = ''
    confirmPassword.value = ''
    toast.success('Contraseña actualizada')
  } else {
    toast.error(result.error || 'Error al cambiar contraseña')
  }
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
  margin-bottom: 32px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f7f7f7;
  margin: 0 auto 16px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 3px solid var(--white);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.avatar-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.profile-hero h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.profile-email {
  font-size: 0.85rem;
  color: var(--gray-text);
}

/* Tabs */
.profile-tabs {
  display: flex;
  background: var(--white);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: var(--black);
}

.tab-btn.active {
  background: var(--black);
  color: var(--white);
}

.tab-btn svg {
  flex-shrink: 0;
}

/* Tab Content */
.tab-content {
  background: var(--white);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tab-panel {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.panel-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--gray-border);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover {
  border-color: var(--gold);
  color: var(--black);
}

.panel-hint {
  font-size: 0.8rem;
  color: var(--gray-text);
  margin-bottom: 20px;
  margin-top: -12px;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.85rem;
  color: var(--gray-text);
}

.info-value {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--black);
}

.info-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-badge.admin {
  background: #dcfce7;
  color: #16a34a;
}

.info-badge.user {
  background: #f3f4f6;
  color: #6b7280;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field.full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  font-weight: 500;
}

.form-field input {
  padding: 12px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  transition: all 0.2s;
  background: #fafafa;
}

.form-field input:focus {
  border-color: var(--gold);
  background: var(--white);
}

.form-field input::placeholder {
  color: #bbb;
}

.mono-input {
  font-family: 'Google Sans Code', monospace !important;
  letter-spacing: 0.5px;
}

.inline-input {
  padding: 6px 12px;
  border: 1px solid var(--gold);
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  background: var(--white);
  width: 180px;
}

.panel-actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-primary {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Google Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #4a4a4a;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: none;
  border: 1px solid var(--gray-border);
  padding: 11px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--black);
  color: var(--black);
}

@media (max-width: 600px) {
  .tab-btn {
    font-size: 0.75rem;
    padding: 10px 8px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
