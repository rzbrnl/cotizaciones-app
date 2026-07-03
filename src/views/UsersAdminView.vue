<template>
  <AppLayout>
    <div class="admin-page">
      <div class="admin-hero">
        <div class="admin-icon">
          <HIcon name="user" :size="48" />
        </div>
        <h1>Usuarios</h1>
        <p>Gestiona los usuarios registrados en la plataforma</p>
      </div>

      <div class="admin-card">
        <div class="admin-card-header">
          <h2>Usuarios registrados ({{ users.length }})</h2>
          <a
            :href="supabaseDashboardUrl"
            target="_blank"
            rel="noopener"
            class="admin-link"
          >
            <HIcon name="external" :size="16" />
            Gestionar en Supabase
          </a>
        </div>

        <div v-if="loading" class="admin-loading">Cargando usuarios...</div>

        <table v-else-if="users.length > 0" class="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="cell-name">{{ user.full_name || '—' }}</td>
              <td class="cell-email">{{ user.email || '—' }}</td>
              <td>
                <span v-if="user.role === 'admin'" class="role-badge admin">Admin</span>
                <span v-else class="role-badge user">Usuario</span>
              </td>
              <td class="cell-date">{{ formatDate(user.created_at) }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else class="admin-empty">
          No hay usuarios registrados
        </div>
      </div>

      <div class="admin-info">
        <HIcon name="info" :size="18" />
        <p>Para agregar, eliminar o editar usuarios, accede al panel de Supabase Dashboard. Desde ahí puedes gestionar autenticación, roles y permisos de cada usuario.</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import AppLayout from '../components/AppLayout.vue'
import HIcon from '../components/HIcon.vue'

const auth = useAuthStore()
const users = ref([])
const loading = ref(true)

const supabaseDashboardUrl = computed(() => {
  const projectId = import.meta.env.VITE_SUPABASE_URL?.match(/https?:\/\/([^.]+)/)?.[1] || ''
  return `https://supabase.com/dashboard/project/${projectId}/auth/users`
})

onMounted(async () => {
  users.value = await auth.getAllUsers()
  loading.value = false
})

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.admin-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 40px 24px;
}

.admin-hero {
  text-align: center;
  margin-bottom: 36px;
}

.admin-icon { color: #999; margin-bottom: 12px; }
.admin-hero h1 { font-size: 1.6rem; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
.admin-hero p { font-size: 0.9rem; color: #666; }

.admin-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  overflow: hidden;
  margin-bottom: 24px;
}

.admin-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.admin-card-header h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

.admin-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1a1a1a;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.admin-link:hover { opacity: 0.85; }

.admin-table { width: 100%; border-collapse: collapse; }

.admin-table thead th {
  text-align: left;
  padding: 12px 24px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #999;
  background: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
}

.admin-table td {
  padding: 14px 24px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover { background: rgba(201,168,106,0.04); }

.cell-name { font-weight: 500; color: #1a1a1a; }
.cell-email { color: #666; }
.cell-date { color: #999; font-size: 0.85rem; }

.role-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.role-badge.admin { background: #f0e6d3; color: #b8964e; }
.role-badge.user { background: #f5f5f5; color: #666; }

.admin-loading, .admin-empty {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
}

.admin-info {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  color: #666;
  align-items: flex-start;
}

.admin-info p { font-size: 0.82rem; line-height: 1.5; }

/* Dark mode overrides */
.dark .admin-hero h1 { color: #e5e7eb !important; }
.dark .admin-hero p { color: #999 !important; }
.dark .admin-card { background: #1a1a1a !important; box-shadow: 0 2px 16px rgba(0,0,0,0.2) !important; }
.dark .admin-card-header { border-bottom-color: #333 !important; }
.dark .admin-card-header h2 { color: #e5e7eb !important; }
.dark .admin-table thead { background: #252525 !important; }
.dark .admin-table thead th { color: #aaa !important; border-bottom-color: #333 !important; }
.dark .admin-table td { border-bottom-color: #2a2a2a !important; }
.dark .admin-table tr:hover { background: rgba(201,168,106,0.08) !important; }
.dark .cell-name { color: #f0f0f0 !important; }
.dark .cell-email { color: #bbb !important; }
.dark .cell-date { color: #999 !important; }
.dark .admin-info { background: #1a1a1a !important; color: #999 !important; }
.dark .admin-link { background: #e5e7eb !important; color: #1a1a1a !important; }
.dark .admin-link:hover { background: #ccc !important; }
</style>
