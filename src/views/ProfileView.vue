<template>
  <AppLayout>
    <div class="profile-page">
      <div class="profile-hero">
        <div class="profile-icon">
          <HIcon name="user" :size="48" />
        </div>
        <h1>Mi perfil</h1>
      </div>

      <div class="profile-content">
        <div class="profile-section">
          <h2>Logo de la empresa</h2>

          <div class="logo-upload" @click="triggerUpload">
            <img v-if="auth.userLogo" :src="auth.userLogo" alt="Logo" class="logo-preview" />
            <div v-else class="logo-empty">
              <HIcon name="image" :size="32" color="#ccc" />
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
              <span class="account-value">{{ auth.profile?.role === 'admin' ? 'Administrador' : 'Usuario' }}</span>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h2>Datos de pago</h2>
          <p class="section-hint">Estos datos se enviarán al cliente cuando apruebe la cotización</p>
          <div class="payment-form">
            <div class="form-field">
              <label>Banco</label>
              <input v-model="paymentData.bank" type="text" placeholder="Ej: BBVA, Banorte, etc." />
            </div>
            <div class="form-field">
              <label>CLABE</label>
              <input v-model="paymentData.clabe" type="text" placeholder="18 dígitos" maxlength="18" />
            </div>
            <div class="form-field">
              <label>Número de cuenta</label>
              <input v-model="paymentData.account" type="text" placeholder="Número de cuenta" />
            </div>
            <div class="form-field">
              <label>Nombre del titular</label>
              <input v-model="paymentData.holder" type="text" placeholder="Nombre como aparece en la cuenta" />
            </div>
            <div class="form-field">
              <label>PayPal (opcional)</label>
              <input v-model="paymentData.paypal" type="email" placeholder="correo@paypal.com" />
            </div>
            <button class="save-payment-btn" @click="savePaymentInfo">
              {{ savingPayment ? 'Guardando...' : 'Guardar datos de pago' }}
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
import AppLayout from '../components/AppLayout.vue'
import HIcon from '../components/HIcon.vue'

const auth = useAuthStore()
const fileInput = ref(null)
const savingPayment = ref(false)

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

async function savePaymentInfo() {
  savingPayment.value = true
  await auth.updatePaymentInfo({ ...paymentData })
  savingPayment.value = false
  alert('Datos de pago guardados')
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

.section-hint {
  font-size: 0.8rem;
  color: var(--gray-text);
  margin-bottom: 16px;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  font-weight: 500;
}

.form-field input {
  padding: 12px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus {
  border-color: var(--gold);
}

.form-field input::placeholder {
  color: #bbb;
}

.save-payment-btn {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Google Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.save-payment-btn:hover {
  background: #4a4a4a;
}

.save-payment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
