<template>
  <div class="app-layout">
    <header class="topbar">
      <div class="topbar-brand">CotizaYa by Vēlum</div>
      <nav class="topbar-nav">
        <router-link to="/perfil" class="topbar-link">Mi perfil</router-link>
        <router-link to="/nueva" class="topbar-link">Crear cotización</router-link>
        <button class="topbar-logout" @click="handleLogout">Cerrar sesión</button>
      </nav>
    </header>
    <main class="topbar-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--white);
}

.topbar {
  background: #353535;
  padding: 0 32px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-brand {
  font-size: 1rem;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.3px;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-link {
  color: rgba(255,255,255,0.7);
  font-size: 0.85rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}

.topbar-link:hover {
  color: var(--white);
}

.topbar-logout {
  background: #e74c3c;
  color: var(--white);
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.topbar-logout:hover {
  opacity: 0.9;
}

.topbar-main {
  min-height: calc(100vh - 56px);
}
</style>
