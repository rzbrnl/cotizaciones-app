<template>
  <div>
    <div class="toolbar">
      <h1>CotizaYa by Vēlum</h1>
      <div class="toolbar-actions">
        <router-link to="/" class="toolbar-btn">Dashboard</router-link>
        <button class="toolbar-btn danger" @click="handleLogout">Salir</button>
      </div>
    </div>

    <div class="profile-page">
      <div class="profile-card">
        <h2>Mi Perfil</h2>

        <div class="profile-section">
          <label class="profile-label">Logo de la empresa</label>
          <p class="profile-hint">
            Este logo aparecerá en todas tus cotizaciones
          </p>

          <div class="logo-upload-area" @click="triggerUpload">
            <img
              v-if="auth.userLogo"
              :src="auth.userLogo"
              alt="Logo actual"
              class="logo-preview"
            />
            <div v-else class="logo-empty">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Click para subir tu logo</span>
              <span class="logo-upload-hint">PNG, JPG o SVG</span>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              hidden
              @change="handleLogoUpload"
            />
          </div>

          <button
            v-if="auth.userLogo"
            class="btn-remove-logo"
            @click="removeLogo"
          >
            Quitar logo
          </button>
        </div>

        <div class="profile-section">
          <label class="profile-label">Información de la cuenta</label>
          <div class="profile-info">
            <div class="profile-info-row">
              <span class="profile-info-label">Nombre:</span>
              <span class="profile-info-value">{{
                auth.currentUser?.fullName
              }}</span>
            </div>
            <div class="profile-info-row">
              <span class="profile-info-label">Usuario:</span>
              <span class="profile-info-value">{{
                auth.currentUser?.username
              }}</span>
            </div>
            <div class="profile-info-row">
              <span class="profile-info-label">Rol:</span>
              <span class="profile-info-value">{{
                auth.currentUser?.role
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const fileInput = ref(null);

function triggerUpload() {
  fileInput.value.click();
}

async function handleLogoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("El logo debe ser menor a 2MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (ev) => {
    await auth.updateLogo(ev.target.result);
  };
  reader.readAsDataURL(file);
  e.target.value = "";
}

async function removeLogo() {
  if (confirm("¿Quitar el logo de tu perfil?")) {
    await auth.updateLogo("");
  }
}

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card {
  background: var(--white);
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.profile-card h2 {
  font-family: "Google Sans", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 28px;
}

.profile-section {
  margin-bottom: 28px;
}

.profile-section:last-child {
  margin-bottom: 0;
}

.profile-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.profile-hint {
  font-size: 0.8rem;
  color: var(--gray-text);
  margin-bottom: 16px;
}

/* Logo upload */
.logo-upload-area {
  width: 160px;
  height: 160px;
  border: 2px dashed var(--gray-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-upload-area:hover {
  border-color: var(--gold);
  background: var(--gold-light);
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.logo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--gray-text);
  text-align: center;
  padding: 16px;
}

.logo-empty span {
  font-size: 0.8rem;
}

.logo-upload-hint {
  font-size: 0.7rem !important;
  color: #bbb !important;
}

.btn-remove-logo {
  margin-top: 12px;
  background: none;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove-logo:hover {
  background: var(--danger);
  color: var(--white);
}

/* Account info */
.profile-info {
  background: var(--gray-light);
  border-radius: 8px;
  padding: 16px 20px;
}

.profile-info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.profile-info-row:not(:last-child) {
  border-bottom: 1px solid var(--gray-border);
}

.profile-info-label {
  font-size: 0.8rem;
  color: var(--gray-text);
}

.profile-info-value {
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
