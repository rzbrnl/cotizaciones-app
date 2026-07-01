<template>
  <div>
    <div class="toolbar">
      <h1>COTIZACIONES</h1>
      <div class="toolbar-actions">
        <span class="toolbar-user">{{ auth.currentUser?.email }}</span>
        <router-link to="/" class="toolbar-btn">Dashboard</router-link>
        <button class="toolbar-btn danger" @click="handleLogout">Salir</button>
      </div>
    </div>

    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Usuarios</h1>
      </div>

      <div class="users-table-wrap">
        <table class="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.full_name || '—' }}</td>
              <td>{{ user.id }}</td>
              <td>{{ formatDate(user.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="users.length === 0" class="users-empty">
          No hay usuarios registrados
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const users = ref([])

onMounted(async () => {
  if (auth.currentUser?.role !== 'admin') {
    router.push('/')
    return
  }
  users.value = await auth.getAllUsers()
})

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.toolbar-user {
  color: var(--gold);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0 8px;
}

.users-table-wrap {
  background: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  background: var(--gray-light);
  border-bottom: 1px solid var(--gray-border);
}

.users-table td {
  padding: 12px 16px;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--gray-border);
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--gray-text);
  font-size: 0.85rem;
}
</style>
