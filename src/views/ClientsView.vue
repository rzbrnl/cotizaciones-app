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
          <div class="client-card-header">
            <div class="client-avatar">{{ client.name?.charAt(0) || '?' }}</div>
            <div class="client-info">
              <div class="client-name">{{ client.name }}</div>
              <div class="client-contact">{{ client.email || client.phone || 'Sin contacto' }}</div>
            </div>
          </div>
          <div class="client-actions">
            <button class="client-action" @click="startNewQuotation(client)" title="Nueva cotización">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
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
import AppLayout from '../components/AppLayout.vue'

const router = useRouter()
const clientsStore = useClientsStore()
const quotationStore = useQuotationStore()
const toast = useToastStore()

const search = ref('')
const showAddModal = ref(false)
const editingClient = ref(null)
const clientForm = ref({ name: '', email: '', phone: '', notes: '' })

const filteredClients = computed(() => {
  return clientsStore.searchClients(search.value)
})

onMounted(async () => {
  await clientsStore.loadClients()
})

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
    await clientsStore.updateClient(editingClient.value.id, clientForm.value)
    toast.success('Cliente actualizado')
  } else {
    await clientsStore.addClient(clientForm.value)
    toast.success('Cliente creado')
  }
  closeModal()
}

async function deleteClient(client) {
  if (confirm(`¿Eliminar a ${client.name}?`)) {
    await clientsStore.deleteClient(client.id)
    toast.success('Cliente eliminado')
  }
}

function closeModal() {
  showAddModal.value = false
  editingClient.value = null
  clientForm.value = { name: '', email: '', phone: '', notes: '' }
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

@media (max-width: 600px) {
  .clients-grid {
    grid-template-columns: 1fr;
  }
}
</style>
