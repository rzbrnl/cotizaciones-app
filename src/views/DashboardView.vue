<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Empty state -->
      <template v-if="!loading && store.savedList.length === 0">
        <div class="empty-hero">
          <div class="empty-icon">
            <HIcon name="document" :size="48" />
          </div>
          <h1>No hay cotizaciones</h1>
          <p>Crea tu primera cotización para comenzar</p>
          <router-link to="/nueva" class="empty-btn">Crear mi primer cotización</router-link>
        </div>
      </template>

      <!-- With data -->
      <template v-else>
        <!-- Reminders -->
        <div v-if="store.pendingReminders.length > 0" class="reminders-section">
          <div class="reminders-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>Recordatorios pendientes ({{ store.pendingReminders.length }})</span>
          </div>
          <div class="reminders-list">
            <div
              v-for="q in store.pendingReminders"
              :key="q.id"
              class="reminder-card"
              @click="router.push(`/editar/${q.id}`)"
            >
              <div class="reminder-info">
                <div class="reminder-client">{{ q.clientName || 'Sin cliente' }}</div>
                <div class="reminder-note">{{ q.reminderNote || 'Sin nota' }}</div>
              </div>
              <div class="reminder-date">{{ formatDate(q.reminderDate) }}</div>
            </div>
          </div>
        </div>

        <!-- Metrics -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-value">{{ store.metrics.total }}</div>
            <div class="metric-label">Total cotizaciones</div>
          </div>
          <div class="metric-card">
            <div class="metric-value gold">{{ formatCurrency(store.metrics.totalRevenue) }}</div>
            <div class="metric-label">Ingresos (aprobadas)</div>
          </div>
          <div class="metric-card">
            <div class="metric-value green">{{ store.metrics.approvalRate }}%</div>
            <div class="metric-label">Tasa de aprobación</div>
          </div>
          <div class="metric-card">
            <div class="metric-value blue">{{ store.metrics.enviadas }}</div>
            <div class="metric-label">Pendientes de respuesta</div>
          </div>
        </div>

        <div class="dashboard-header">
          <div class="header-left">
            <div class="header-icon">
              <HIcon name="document" :size="36" />
            </div>
            <h1>Mis cotizaciones</h1>
          </div>
          <router-link to="/nueva" class="new-quote-btn">
            <HIcon name="plus" :size="18" />
            Nueva cotización
          </router-link>
        </div>

        <!-- Search and filters -->
        <div class="dashboard-toolbar">
          <div class="search-box">
            <HIcon name="search" :size="16" />
            <input
              v-model="search"
              type="text"
              placeholder="Buscar por cliente o venue..."
              class="search-input"
            />
          </div>
          <div class="filter-tabs">
            <button
              v-for="f in filters"
              :key="f.value"
              class="filter-tab"
              :class="{ active: activeFilter === f.value }"
              @click="activeFilter = f.value"
            >
              <span class="filter-dot" :class="f.value"></span>
              {{ f.label }}
              <span class="filter-count">{{ getCount(f.value) }}</span>
            </button>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="dashboard-grid">
          <div v-for="i in 4" :key="i" class="skeleton-card">
            <SkeletonLoader variant="title" width="60%" />
            <SkeletonLoader variant="text" width="40%" />
            <SkeletonLoader variant="text" width="30%" />
          </div>
        </div>

        <!-- Results -->
        <div v-else-if="filtered.length > 0" class="dashboard-grid">
          <QuotationCard
            v-for="q in filtered"
            :key="q.id"
            :quotation="q"
            @edit="editQuotation"
            @delete="deleteQuotation"
          />
        </div>

        <div v-else class="dashboard-empty">
          <p>No se encontraron cotizaciones</p>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'
import { useConfirmStore } from '../stores/confirm'
import { formatCurrency } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import QuotationCard from '../components/QuotationCard.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import HIcon from '../components/HIcon.vue'

const store = useQuotationStore()
const toast = useToastStore()
const confirmStore = useConfirmStore()
const router = useRouter()

const loading = ref(true)
const search = ref('')
const activeFilter = ref('todos')

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
]

const filtered = computed(() => {
  let list = store.savedList

  if (activeFilter.value !== 'todos') {
    list = list.filter(q => (q.status || 'borrador') === activeFilter.value)
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(item =>
      (item.clientName || '').toLowerCase().includes(q) ||
      (item.venue || '').toLowerCase().includes(q) ||
      (item.eventType || '').toLowerCase().includes(q)
    )
  }

  return list
})

function getCount(filterValue) {
  if (filterValue === 'todos') return store.savedList.length
  return store.savedList.filter(q => (q.status || 'borrador') === filterValue).length
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

onMounted(async () => {
  await store.loadAll()
  loading.value = false
})

function editQuotation(id) {
  router.push(`/editar/${id}`)
}

async function deleteQuotation(id) {
  const answer = await confirmStore.show({
    title: 'Eliminar cotización',
    message: '¿Estás seguro de que quieres eliminar esta cotización? Esta acción no se puede deshacer.',
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger',
  })
  if (answer) {
    await store.deleteById(id)
    toast.success('Cotización eliminada')
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Reminders */
.reminders-section {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.reminders-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 12px;
}

.reminders-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.reminder-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.reminder-client {
  font-weight: 500;
  color: var(--black);
  font-size: 0.88rem;
}

.reminder-note {
  font-size: 0.78rem;
  color: var(--gray-text);
  margin-top: 2px;
}

.reminder-date {
  font-size: 0.78rem;
  color: #92400e;
  font-weight: 500;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.metric-card {
  background: var(--white);
  border-radius: 12px;
  padding: 18px 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--black);
  margin-bottom: 4px;
}

.metric-value.gold { color: var(--gold); }
.metric-value.green { color: #16a34a; }
.metric-value.blue { color: #3b82f6; }

.metric-label {
  font-size: 0.72rem;
  color: var(--gray-text);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Empty state */
.empty-hero {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: #999;
  margin-bottom: 16px;
}

.empty-hero h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.empty-hero p {
  font-size: 0.9rem;
  color: var(--gray-text);
  margin-bottom: 28px;
}

.empty-btn {
  display: inline-block;
  background: var(--black);
  color: var(--white);
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.empty-btn:hover {
  opacity: 0.9;
}

/* Header */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #999;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
}

.new-quote-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--black);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.new-quote-btn:hover {
  background: #4a4a4a;
}

/* Toolbar */
.dashboard-toolbar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  padding: 10px 14px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--gold);
}

.search-box svg {
  color: #bbb;
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  width: 100%;
  background: transparent;
}

.search-input::placeholder {
  color: #bbb;
}

.filter-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 20px;
  background: var(--white);
  font-size: 0.78rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: var(--gold);
  color: var(--black);
}

.filter-tab.active {
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
}

.filter-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.filter-dot.borrador { background: #9ca3af; }
.filter-dot.enviada { background: #3b82f6; }
.filter-dot.aprobada { background: #22c55e; }
.filter-dot.rechazada { background: #ef4444; }

.filter-tab.active .filter-dot {
  box-shadow: 0 0 0 2px rgba(255,255,255,0.3);
}

.filter-count {
  background: rgba(0,0,0,0.08);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.filter-tab.active .filter-count {
  background: rgba(255,255,255,0.2);
}

/* Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* Skeleton */
.skeleton-card {
  background: var(--white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

/* Empty search */
.dashboard-empty {
  text-align: center;
  padding: 48px 20px;
  color: var(--gray-text);
  font-size: 0.9rem;
}

@media (max-width: 700px) {
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }
}
</style>
