<template>
  <AppLayout>
    <div class="clients-page">
      <div class="clients-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1>Mis clientes</h1>
        </div>
        <button class="new-client-btn" @click="showAddModal = true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo cliente
        </button>
      </div>

      <!-- Search -->
      <div class="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Buscar por nombre, email o teléfono..." class="search-input" />
      </div>

      <!-- Clients list -->
      <div v-if="filteredClients.length > 0" class="clients-grid">
        <div
          v-for="client in filteredClients"
          :key="client.id"
          class="client-card"
        >
          <div class="client-card-header" @click="showClientQuotations(client)">
            <div class="client-avatar">{{ client.name?.charAt(0) || '?' }}</div>
            <div class="client-info">
              <div class="client-name">{{ client.name }}</div>
              <div class="client-contact">{{ client.email || client.phone || 'Sin contacto' }}</div>
            </div>
            <span v-if="quotationCounts[client.name]" class="client-count">
              {{ quotationCounts[client.name] }} cotización{{ quotationCounts[client.name] !== 1 ? 'es' : '' }}
            </span>
          </div>
          <div class="client-actions">
            <button class="client-action" @click="startNewQuotation(client)" title="Nueva cotización">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button class="client-action" @click="showClientQuotations(client)" title="Ver cotizaciones">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </button>
            <button class="client-action" @click="editClient(client)" title="Editar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="client-action delete" @click="deleteClient(client)" title="Eliminar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="clients-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p>No tienes clientes registrados</p>
        <span>Agrega tu primer cliente para comenzar</span>
      </div>
    </div>

    <!-- Client Quotations Modal -->
    <Teleport to="body">
      <div v-if="showQuotationsModal" class="modal-overlay" @click.self="showQuotationsModal = false">
        <div class="client-modal">
          <div class="modal-header">
            <h3>Cotizaciones de {{ selectedClientName }}</h3>
            <button class="modal-close" @click="showQuotationsModal = false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedClientQuotations.length > 0" class="quotations-list">
              <div
                v-for="q in selectedClientQuotations"
                :key="q.id"
                class="quotation-item"
                @click="editQuotation(q)"
              >
                <div class="quotation-info">
                  <div class="quotation-event">{{ q.eventType || 'Sin tipo' }}</div>
                  <div class="quotation-venue">{{ q.venue || 'Sin venue' }} · {{ q.eventDate || 'Sin fecha' }}</div>
                </div>
                <div class="quotation-right">
                  <span class="status-badge" :class="q.status || 'borrador'">
                    {{ statusLabels[q.status] || 'Borrador' }}
                  </span>
                  <div class="quotation-price">{{ formatCurrency(getTotal(q)) }}</div>
                </div>
              </div>
            </div>
            <div v-else class="quotations-empty">
              Este cliente no tiene cotizaciones
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showAddModal || editingClient" class="modal-overlay" @click.self="closeModal">
        <div class="client-modal">
          <div class="modal-header">
            <h3>{{ editingClient ? 'Editar cliente' : 'Nuevo cliente' }}</h3>
            <button class="modal-close" @click="closeModal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-field">
              <label>Nombre *</label>
              <input v-model="clientForm.name" type="text" placeholder="Nombre del cliente" />
            </div>
            <div class="form-field">
              <label>Email</label>
              <input v-model="clientForm.email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div class="form-field">
              <label>Teléfono</label>
              <input v-model="clientForm.phone" type="tel" placeholder="000 000 0000" />
            </div>
            <div class="form-field">
              <label>Notas</label>
              <textarea v-model="clientForm.notes" placeholder="Notas sobre el cliente..." rows="3"></textarea>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closeModal">Cancelar</button>
              <button class="btn-primary" @click="saveClient" :disabled="!clientForm.name.trim()">
                {{ editingClient ? 'Guardar' : 'Crear cliente' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientsStore } from '../stores/clients'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'
import { useConfirmStore } from '../stores/confirm'
import { formatCurrency } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()
const clientsStore = useClientsStore()
const quotationStore = useQuotationStore()
const toast = useToastStore()
const confirmStore = useConfirmStore()

const search = ref('')
const showAddModal = ref(false)
const editingClient = ref(null)
const clientForm = ref({ name: '', email: '', phone: '', notes: '' })
const showQuotationsModal = ref(false)
const selectedClientQuotations = ref([])
const selectedClientName = ref('')

const statusLabels = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

function getTotal(q) {
  let total = 0
  for (const section of q.sections || []) {
    for (const item of section.items || []) {
      total += (item.qty || 0) * (item.unitPrice || 0)
    }
  }
  return total
}

const filteredClients = computed(() => {
  return clientsStore.searchClients(search.value)
})

// Count quotations per client
const clientQuotationCount = computed(() => {
  const counts = {}
  const quotations = quotationStore.savedList
  if (!quotations) return counts
  for (const q of quotations) {
    const name = q.clientName
    if (name) {
      counts[name] = (counts[name] || 0) + 1
    }
  }
  return counts
})

const quotationCounts = ref({})

onMounted(async () => {
  await clientsStore.loadClients()
  await quotationStore.loadAll()
  updateQuotationCounts()
})

// Update counts when savedList changes
watch(() => quotationStore.savedList, () => {
  updateQuotationCounts()
}, { deep: true })

function updateQuotationCounts() {
  const counts = {}
  const quotations = quotationStore.savedList
  if (!quotations) return
  for (const q of quotations) {
    const name = q.clientName
    if (name) {
      counts[name] = (counts[name] || 0) + 1
    }
  }
  quotationCounts.value = counts
}

function startNewQuotation(client) {
  quotationStore.createNew()
  quotationStore.active.clientName = client.name
  quotationStore.active.clientEmail = client.email
  quotationStore.active.clientPhone = client.phone
  router.push('/nueva')
}

function editClient(client) {
  editingClient.value = client
  clientForm.value = {
    name: client.name,
    email: client.email || '',
    phone: client.phone || '',
    notes: client.notes || '',
  }
}

async function saveClient() {
  if (!clientForm.value.name.trim()) return

  if (editingClient.value) {
    const success = await clientsStore.updateClient(editingClient.value.id, clientForm.value)
    if (success) {
      toast.success('Cliente actualizado')
      closeModal()
    } else {
      toast.error('No se pudo actualizar el cliente')
    }
  } else {
    const result = await clientsStore.addClient(clientForm.value)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Cliente creado')
      closeModal()
    }
  }
}

async function deleteClient(client) {
  const answer = await confirmStore.show({
    title: 'Eliminar cliente',
    message: `¿Estás seguro de que quieres eliminar a ${client.name}? Esta acción no se puede deshacer.`,
    confirmText: 'Eliminar',
    cancelText: 'Cancelar',
    type: 'danger',
  })
  if (answer) {
    const success = await clientsStore.deleteClient(client.id)
    if (success) {
      toast.success('Cliente eliminado')
    } else {
      toast.error('No se pudo eliminar el cliente')
    }
  }
}

function closeModal() {
  showAddModal.value = false
  editingClient.value = null
  clientForm.value = { name: '', email: '', phone: '', notes: '' }
}

async function showClientQuotations(client) {
  selectedClientName.value = client.name
  selectedClientQuotations.value = await clientsStore.getClientQuotations(client.id)
  showQuotationsModal.value = true
}

function editQuotation(quotation) {
  showQuotationsModal.value = false
  router.push(`/editar/${quotation.id || quotation._dbId}`)
}
</script>

<style scoped>
.clients-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.clients-header {
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

.clients-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
}

.new-client-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--black);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.new-client-btn:hover {
  background: #4a4a4a;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--white);
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 20px;
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

.clients-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.client-card {
  background: var(--white);
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s;
}

.client-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.client-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gold);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  flex-shrink: 0;
}

.client-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black);
}

.client-contact {
  font-size: 0.78rem;
  color: var(--gray-text);
}

.client-count {
  font-size: 0.7rem;
  background: rgba(201, 168, 106, 0.1);
  color: var(--gold);
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.client-actions {
  display: flex;
  gap: 6px;
}

.client-action {
  background: none;
  border: 1px solid var(--gray-border);
  padding: 6px;
  border-radius: 6px;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.client-action:hover {
  border-color: var(--gold);
  color: var(--black);
}

.client-action.delete:hover {
  border-color: #e74c3c;
  color: #e74c3c;
}

.clients-empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-text);
}

.clients-empty svg {
  color: #ccc;
  margin-bottom: 12px;
}

.clients-empty p {
  font-size: 1rem;
  color: var(--black);
  margin-bottom: 4px;
}

.clients-empty span {
  font-size: 0.85rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-modal {
  background: var(--white);
  border-radius: 16px;
  width: 90%;
  max-width: 440px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-border);
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
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

.modal-body {
  padding: 20px 24px 24px;
}

.form-field {
  margin-bottom: 16px;
}

.form-field label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  font-weight: 500;
  margin-bottom: 6px;
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;
}

.form-field input:focus,
.form-field textarea:focus {
  border-color: var(--gold);
}

.form-field textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-secondary {
  background: none;
  border: 1px solid var(--gray-border);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: var(--black);
  color: var(--black);
}

.btn-primary {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Google Sans', sans-serif;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background: #4a4a4a;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Quotations Modal */
.quotations-list {
  max-height: 300px;
  overflow-y: auto;
}

.quotation-item {
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

.quotation-item:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 106, 0.04);
}

.quotation-event {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 2px;
}

.quotation-venue {
  font-size: 0.78rem;
  color: var(--gray-text);
}

.quotation-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.quotation-price {
  font-weight: 600;
  color: var(--gold);
}

.quotations-empty {
  text-align: center;
  padding: 32px;
  color: var(--gray-text);
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.borrador {
  background: #f3f4f6;
  color: #6b7280;
}

.status-badge.enviada {
  background: #dbeafe;
  color: #2563eb;
}

.status-badge.aprobada {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.rechazada {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 600px) {
  .clients-grid {
    grid-template-columns: 1fr;
  }
}
</style>
