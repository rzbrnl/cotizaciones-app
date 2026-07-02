<template>
  <div class="app-layout">
    <header class="topbar">
      <div class="topbar-brand">CotizaYa by Vēlum</div>
      <nav class="topbar-nav">
        <slot name="actions" />
        <router-link to="/nueva" class="topbar-btn-new">Nueva cotización</router-link>
        <div class="topbar-links-desktop">
          <router-link to="/perfil" class="topbar-link">Mi perfil</router-link>
          <router-link to="/usuarios" class="topbar-link" v-if="isAdmin">Usuarios</router-link>
          <router-link to="/" class="topbar-link">Dashboard</router-link>
        </div>
        <button class="topbar-logout" @click="handleLogout">Salir</button>
        <button class="topbar-menu-btn" @click="menuOpen = !menuOpen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </nav>
    </header>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="mobile-menu" @click="menuOpen = false">
      <nav class="mobile-menu-nav" @click.stop>
        <router-link to="/nueva" class="mobile-menu-link" @click="menuOpen = false">Nueva cotización</router-link>
        <router-link to="/" class="mobile-menu-link" @click="menuOpen = false">Dashboard</router-link>
        <router-link to="/perfil" class="mobile-menu-link" @click="menuOpen = false">Mi perfil</router-link>
        <router-link v-if="isAdmin" to="/usuarios" class="mobile-menu-link" @click="menuOpen = false">Usuarios</router-link>
        <button class="mobile-menu-logout" @click="handleLogout">Cerrar sesión</button>
      </nav>
    </div>

    <main class="topbar-main">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

const isAdmin = computed(() => {
  return auth.profile?.role === 'admin' || auth.currentUser?.user_metadata?.role === 'admin'
})

async function handleLogout() {
  menuOpen.value = false
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f0f0f0;
}

.topbar {
  background: #353535;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-brand {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.3px;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-links-desktop {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar-link {
  color: rgba(255,255,255,0.7);
  font-size: 0.82rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}

.topbar-link:hover {
  color: var(--white);
}

.topbar-btn-new {
  background: var(--gold);
  color: var(--black);
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}

.topbar-btn-new:hover {
  background: var(--gold-hover);
  color: var(--white);
}

.topbar-logout {
  background: #e74c3c;
  color: var(--white);
  border: none;
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.topbar-logout:hover {
  opacity: 0.9;
}

.topbar-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  padding: 4px;
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
}

.mobile-menu-nav {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  background: #353535;
  padding: 80px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-menu-link {
  display: block;
  padding: 12px 16px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 0.9rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.mobile-menu-link:hover {
  background: rgba(255,255,255,0.1);
  color: var(--white);
}

.mobile-menu-logout {
  margin-top: 16px;
  background: #e74c3c;
  color: var(--white);
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.topbar-main {
  min-height: calc(100vh - 56px);
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
  }

  .topbar-links-desktop {
    display: none;
  }

  .topbar-logout {
    display: none;
  }

  .topbar-menu-btn {
    display: flex;
  }
}
</style>
