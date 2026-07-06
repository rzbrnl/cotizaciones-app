<template>
  <div class="app-layout">
    <header class="topbar">
      <router-link to="/" class="topbar-brand">CotizaYa by Vēlum</router-link>
      <nav class="topbar-nav">
        <slot name="actions" />
        <div class="topbar-separator" v-if="$slots.actions"></div>
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
        <div class="topbar-links-desktop">
          <router-link to="/" class="topbar-link">Dashboard</router-link>
          <router-link to="/calendario" class="topbar-link">Calendario</router-link>
          <router-link to="/perfil" class="topbar-link">Mi perfil</router-link>
          <router-link to="/usuarios" class="topbar-link" v-if="isAdmin">Usuarios</router-link>
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

    <div v-if="menuOpen" class="mobile-menu" @click="menuOpen = false">
      <nav class="mobile-menu-nav" @click.stop>
        <router-link to="/" class="mobile-menu-link" @click="menuOpen = false">Dashboard</router-link>
        <router-link to="/calendario" class="mobile-menu-link" @click="menuOpen = false">Calendario</router-link>
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
import { useThemeStore } from '../stores/theme'

const auth = useAuthStore()
const themeStore = useThemeStore()
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
  gap: 16px;
}

.topbar-separator {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.15);
}

.theme-toggle {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.theme-toggle:hover {
  color: var(--white);
  background: rgba(255,255,255,0.1);
}

.topbar-links-desktop {
  display: flex;
  align-items: center;
  gap: 20px;
}

.topbar-link {
  color: rgba(255,255,255,0.6);
  font-size: 0.82rem;
  font-weight: 400;
  text-decoration: none;
  transition: color 0.2s;
}

.topbar-link:hover {
  color: var(--white);
}

.topbar-logout {
  background: none;
  color: rgba(255,255,255,0.5);
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.topbar-logout:hover {
  color: var(--white);
  background: rgba(255,255,255,0.08);
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
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  text-align: center;
  font-family: 'Google Sans', sans-serif;
  transition: all 0.2s;
}

.mobile-menu-logout:hover {
  background: rgba(255,255,255,0.08);
  color: var(--white);
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

  .topbar-separator {
    display: none;
  }

  .topbar-menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .topbar {
    padding: 0 12px;
  }

  .topbar-brand {
    font-size: 0.85rem;
    letter-spacing: 0.1px;
    max-width: none;
    overflow: visible;
  }

  .topbar-nav {
    gap: 6px;
  }

  .status-trigger {
    padding: 4px 6px;
    font-size: 0.65rem;
    gap: 2px;
  }

  .status-dot {
    width: 5px;
    height: 5px;
  }

  .status-text {
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status-trigger svg {
    width: 8px;
    height: 8px;
  }

  .topbar-icon-btn {
    padding: 6px;
  }
}
</style>
