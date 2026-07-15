<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Empty state -->
      <template v-if="!loading && store.savedList.length === 0">
        <div class="empty-hero">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <h1>Empieza a cotizar</h1>
          <p>Crea cotizaciones profesionales, compártelas con tus clientes y recibe pagos</p>
          <div class="empty-features">
            <div class="empty-feature">
              <span class="empty-feature-icon">1</span>
              <span>Crea tu cotización con conceptos y precios</span>
            </div>
            <div class="empty-feature">
              <span class="empty-feature-icon">2</span>
              <span>Compártela por WhatsApp o enlace público</span>
            </div>
            <div class="empty-feature">
              <span class="empty-feature-icon">3</span>
              <span>El cliente aprueba y tú recibes el pago</span>
            </div>
          </div>
          <router-link to="/nueva" class="empty-btn">Crear mi primera cotización</router-link>
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
          <div class="filter-row">
            <!-- Desktop: pill tabs -->
            <div class="filter-tabs-desktop">
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
            <!-- Mobile: dropdown -->
            <select v-model="activeFilter" class="filter-select-mobile">
              <option v-for="f in filters" :key="f.value" :value="f.value">
                {{ f.label }} ({{ getCount(f.value) }})
              </option>
            </select>
            <select v-model="sortBy" class="sort-select">
              <option value="newest">Más reciente</option>
              <option value="oldest">Más antiguo</option>
              <option value="highest">Mayor monto</option>
              <option value="lowest">Menor monto</option>
            </select>
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
            @duplicate="duplicateQuotation"
            @share="openShareModal"
            @request-payment="sendPaymentWhatsApp"
            @client-history="openClientHistory"
          />
        </div>

        <div v-else class="dashboard-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <p>No se encontraron cotizaciones</p>
          <span class="dashboard-empty-hint">Prueba con otros filtros o términos de búsqueda</span>
        </div>
      </template>
    </div>

    <ShareModal
      :open="shareModalOpen"
      :quotation="shareQuotation"
      @close="shareModalOpen = false"
    />

    <!-- Client History Modal -->
    <Teleport to="body">
      <div v-if="clientHistoryOpen" class="modal-overlay" @click.self="clientHistoryOpen = false">
        <div class="client-history-modal">
          <div class="client-history-header">
            <h3>{{ clientHistoryName }}</h3>
            <button class="modal-close" @click="clientHistoryOpen = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="client-history-list">
            <div
              v-for="q in clientQuotations"
              :key="q.id"
              class="client-history-item"
              @click="editQuotation(q.id)"
            >
              <div class="client-history-info">
                <div class="client-history-event">{{ q.eventType || 'Sin tipo' }}</div>
                <div class="client-history-date">{{ q.eventDate || q.date || 'Sin fecha' }}</div>
              </div>
              <div class="client-history-right">
                <span class="status-badge" :class="q.status || 'borrador'">
                  {{ statusLabels[q.status] || 'Borrador' }}
                </span>
                <div class="client-history-total">{{ formatCurrency(getQuotationTotal(q)) }}</div>
              </div>
            </div>
            <div v-if="clientQuotations.length === 0" class="client-history-empty">
              No hay cotizaciones para este cliente
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'
import { useConfirmStore } from '../stores/confirm'
import { useAuthStore } from '../stores/auth'
import { useWhatsApp } from '../composables/useWhatsApp'
import { formatCurrency } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import QuotationCard from '../components/QuotationCard.vue'
import ShareModal from '../components/ShareModal.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import HIcon from '../components/HIcon.vue'

const store = useQuotationStore()
const toast = useToastStore()
const confirmStore = useConfirmStore()
const auth = useAuthStore()
const { sendPaymentWhatsApp: sendWa } = useWhatsApp()
const router = useRouter()

const loading = ref(true)
const search = ref('')
const activeFilter = ref('todos')
const sortBy = ref('newest')
const shareModalOpen = ref(false)
const shareQuotation = ref(null)
const clientHistoryOpen = ref(false)
const clientHistoryName = ref('')

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
]

const statusLabels = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

const clientQuotations = computed(() => {
  if (!clientHistoryName.value) return []
  return store.savedList.filter(q => q.clientName === clientHistoryName.value)
})

function getQuotationTotal(q) {
  let total = 0
  for (const section of q.sections || []) {
    for (const item of section.items || []) {
      total += (item.qty || 0) * (item.unitPrice || 0)
    }
  }
  return total
}

function openClientHistory(clientName) {
  clientHistoryName.value = clientName
  clientHistoryOpen.value = true
}

const filtered = computed(() => {
  let list = [...store.savedList]

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

  // Sort
  list.sort((a, b) => {
    const createdA = a.createdAt || ''
    const createdB = b.createdAt || ''
    const totalA = (a.sections || []).reduce((sum, s) => sum + (s.items || []).reduce((sum2, i) => sum2 + (i.qty || 0) * (i.unitPrice || 0), 0), 0)
    const totalB = (b.sections || []).reduce((sum, s) => sum + (s.items || []).reduce((sum2, i) => sum2 + (i.qty || 0) * (i.unitPrice || 0), 0), 0)

    switch (sortBy.value) {
      case 'oldest': return createdA.localeCompare(createdB)
      case 'highest': return totalB - totalA
      case 'lowest': return totalA - totalB
      default: return createdB.localeCompare(createdA) // newest
    }
  })

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

  document.addEventListener('visibilitychange', handleVisibility)

  // Subscribe to real-time changes instead of polling
  store.subscribeToChanges(async () => {
    if (document.visibilityState === 'visible') {
      await store.loadAll()
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibility)
  store.unsubscribeFromChanges()
})

async function handleVisibility() {
  if (document.visibilityState === 'visible') {
    await store.loadAll()
  }
}

function editQuotation(id) {
  router.push(`/editar/${id}`)
}

function openShareModal(quotation) {
  shareQuotation.value = quotation
  shareModalOpen.value = true
}

function sendPaymentWhatsApp(quotation) {
  sendWa(quotation, auth.paymentInfo, auth.profile)
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

function duplicateQuotation(id) {
  const copy = store.duplicate(id)
  if (copy) {
    store.active = copy
    router.push('/nueva')
    toast.success('Cotización duplicada')
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
  overflow: hidden;
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
  color: #ccc;
  margin-bottom: 20px;
}

.empty-hero h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 8px;
}

.empty-hero p {
  font-size: 0.9rem;
  color: var(--gray-text);
  margin-bottom: 28px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 320px;
  margin: 0 auto 32px;
  text-align: left;
}

.empty-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--gray-text);
}

.empty-feature-icon {
  width: 28px;
  height: 28px;
  background: var(--gold);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
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
  transition: all 0.2s;
}

.empty-btn:hover {
  background: #4a4a4a;
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

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sort-select {
  padding: 6px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 20px;
  background: var(--white);
  font-size: 0.78rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 28px;
}

.sort-select:hover {
  border-color: var(--gold);
  color: var(--black);
}

.sort-select:focus {
  border-color: var(--gold);
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

.filter-dot.todos { background: #6b7280; }
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

.filter-tabs-desktop {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-select-mobile {
  display: none;
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

.dashboard-empty svg {
  color: #ccc;
  margin-bottom: 12px;
}

.dashboard-empty p {
  margin-bottom: 4px;
}

.dashboard-empty-hint {
  font-size: 0.8rem;
  color: #bbb;
}

/* Client History Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-history-modal {
  background: var(--white);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.client-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-border);
}

.client-history-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
}

.modal-close {
  background: none;
  border: none;
  color: var(--gray-text);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--gray-light);
  color: var(--black);
}

.client-history-list {
  padding: 16px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.client-history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.client-history-item:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 106, 0.04);
}

.client-history-item:last-child {
  margin-bottom: 0;
}

.client-history-info {
  flex: 1;
}

.client-history-event {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--black);
  margin-bottom: 2px;
}

.client-history-date {
  font-size: 0.78rem;
  color: var(--gray-text);
}

.client-history-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.client-history-total {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gold);
}

.client-history-empty {
  text-align: center;
  padding: 40px 20px;
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
