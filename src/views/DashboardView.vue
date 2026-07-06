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
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'
import { useConfirmStore } from '../stores/confirm'
import { useAuthStore } from '../stores/auth'
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
const router = useRouter()

const loading = ref(true)
const search = ref('')
const activeFilter = ref('todos')
const sortBy = ref('newest')
const shareModalOpen = ref(false)
const shareQuotation = ref(null)

const filters = [
  { value: 'todos', label: 'Todos' },
  { value: 'borrador', label: 'Borrador' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' },
]

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
    const dateA = a.eventDate || a.date || ''
    const dateB = b.eventDate || b.date || ''
    const totalA = (a.sections || []).reduce((sum, s) => sum + (s.items || []).reduce((sum2, i) => sum2 + (i.qty || 0) * (i.unitPrice || 0), 0), 0)
    const totalB = (b.sections || []).reduce((sum, s) => sum + (s.items || []).reduce((sum2, i) => sum2 + (i.qty || 0) * (i.unitPrice || 0), 0), 0)

    switch (sortBy.value) {
      case 'oldest': return dateA.localeCompare(dateB)
      case 'highest': return totalB - totalA
      case 'lowest': return totalA - totalB
      default: return dateB.localeCompare(dateA) // newest
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

let refreshInterval = null

onMounted(async () => {
  await store.loadAll()
  loading.value = false

  document.addEventListener('visibilitychange', handleVisibility)

  // Poll for changes every 10 seconds when tab is visible
  refreshInterval = setInterval(async () => {
    if (document.visibilityState === 'visible') {
      await store.loadAll()
    }
  }, 10000)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibility)
  if (refreshInterval) clearInterval(refreshInterval)
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

async function sendPaymentWhatsApp(quotation) {
  const pi = auth.paymentInfo
  if (!pi || (!pi.bank && !pi.clabe && !pi.paypal)) {
    toast.error('Configura tus datos de pago en tu perfil')
    return
  }

  const q = quotation
  let total = 0
  for (const section of q.sections || []) {
    for (const item of section.items || []) {
      total += (item.qty || 0) * (item.unitPrice || 0)
    }
  }

  const userName = auth.profile?.full_name || ''

  let message = `✨ *Cotización aprobada*\n\n`
  message += `Hola ${q.clientName || ''},\n\n`
  message += `Tu cotización ha sido aprobada. A continuación los datos para realizar el depósito:\n\n`
  message += `📅 *Evento:* ${q.eventType || '—'}\n`
  message += `📍 *Venue:* ${q.venue || '—'}\n`
  message += `📆 *Fecha:* ${q.eventDate || '—'}\n`
  message += `💰 *Total:* $${total.toLocaleString('es-MX')} MXN\n\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
  message += `🏦 *Datos de pago:*\n\n`

  if (pi.bank) message += `*Banco:* ${pi.bank}\n`
  if (pi.clabe) message += `*CLABE:* ${pi.clabe}\n`
  if (pi.account) message += `*Cuenta:* ${pi.account}\n`
  if (pi.holder) message += `*Titular:* ${pi.holder}\n`
  if (pi.paypal) message += `*PayPal:* ${pi.paypal}\n`

  message += `\nUna vez realizado el pago, por favor envíame el comprobante 🙏\n\n`
  message += `Saludos,\n${userName}`

  const encoded = encodeURIComponent(message)
  const clientPhone = q.clientPhone?.replace(/\D/g, '')

  if (clientPhone) {
    window.open(`https://api.whatsapp.com/send?phone=52${clientPhone}&text=${encoded}`, '_blank')
  } else {
    await navigator.clipboard.writeText(message)
    toast.info('No se encontró teléfono. Mensaje copiado al portapapeles.')
  }
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
  padding: 6px 12px;
  border: 1px solid var(--gray-border);
  border-radius: 20px;
  background: var(--white);
  font-size: 0.78rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.sort-select:hover {
  border-color: var(--gold);
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
