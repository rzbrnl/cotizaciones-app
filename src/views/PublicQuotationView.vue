<template>
  <div class="public-page">
    <div v-if="quotation" class="public-quotation">
      <div class="public-header">
        <h1>Cotización</h1>
        <div class="public-date">{{ quotation.date }}</div>
      </div>

      <div class="public-client">
        <div class="client-row">
          <span class="client-label">Evento:</span>
          <span class="client-value">{{ quotation.eventType || '—' }}</span>
        </div>
        <div class="client-row">
          <span class="client-label">Venue:</span>
          <span class="client-value">{{ quotation.venue || '—' }}</span>
        </div>
        <div class="client-row">
          <span class="client-label">Fecha:</span>
          <span class="client-value">{{ quotation.eventDate || '—' }}</span>
        </div>
      </div>

      <table class="public-table">
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allItems" :key="item.id">
            <td>{{ item.name || '—' }}</td>
            <td>{{ item.qty }}</td>
            <td>{{ formatCurrency(item.unitPrice) }}</td>
            <td>{{ formatCurrency(item.qty * item.unitPrice) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="public-total">
        <span>Total</span>
        <span>{{ formatCurrency(total) }} MXN</span>
      </div>

      <div v-if="quotation.notes" class="public-notes">
        <strong>Notas:</strong> {{ quotation.notes }}
      </div>

      <!-- Action buttons -->
      <div v-if="quotation.status === 'enviada'" class="public-actions">
        <button class="action-btn approve" @click="handleApprove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Aprobar cotización
        </button>
        <button class="action-btn reject" @click="handleReject">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Rechazar
        </button>
      </div>

      <div v-else-if="quotation.status === 'aprobada'" class="public-status approved">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Esta cotización fue aprobada
      </div>

      <div v-else-if="quotation.status === 'rechazada'" class="public-status rejected">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        Esta cotización fue rechazada
      </div>
    </div>

    <div v-else class="public-empty">
      <h2>Cotización no encontrada</h2>
      <p>El enlace no es válido o la cotización ha sido eliminada.</p>
    </div>

    <div class="public-footer">
      CotizaYa by Vēlum
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { decodeQuotation } from '../utils/share'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../utils/format'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const toast = useToastStore()
const quotation = ref(null)

const allItems = computed(() => {
  if (!quotation.value) return []
  const items = []
  for (const section of quotation.value.sections || []) {
    for (const item of section.items || []) {
      items.push(item)
    }
  }
  return items
})

const total = computed(() => {
  return allItems.value.reduce((sum, item) => sum + (item.qty || 0) * (item.unitPrice || 0), 0)
})

async function handleApprove() {
  if (!quotation.value) return
  quotation.value.status = 'aprobada'
  await updateStatus('aprobada')
  await sendNotification('aprobada')
  toast.success('Cotización aprobada')
}

async function handleReject() {
  if (!quotation.value) return
  quotation.value.status = 'rechazada'
  await updateStatus('rechazada')
  await sendNotification('rechazada')
  toast.info('Cotización rechazada')
}

async function sendNotification(action) {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        clientName: quotation.value.clientName,
        venue: quotation.value.venue,
        eventDate: quotation.value.eventDate,
        ownerEmail: quotation.value.ownerEmail,
      }),
    })
  } catch (err) {
    console.error('Notification error:', err)
  }
}

async function updateStatus(newStatus) {
  if (!quotation.value) return

  const searchData = { ...quotation.value, status: newStatus }

  // Search by local ID
  const { data: all } = await supabase
    .from('quotations')
    .select('id, data')

  if (!all) return

  const match = all.find(q => q.data?.id === quotation.value.id)

  if (match) {
    const { error } = await supabase
      .from('quotations')
      .update({ data: searchData })
      .eq('id', match.id)

    if (error) {
      console.error('Update error:', error)
    }
  } else {
    console.error('No matching quotation found for id:', quotation.value.id)
  }
}

onMounted(() => {
  const hash = route.params.hash
  if (hash) {
    quotation.value = decodeQuotation(hash)
  }
})
</script>

<style scoped>
.public-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.public-quotation {
  background: var(--white);
  width: 100%;
  max-width: 700px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.public-header {
  background: var(--black);
  padding: 28px 32px;
  color: var(--white);
}

.public-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: 4px;
}

.public-date {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.5);
}

.public-client {
  padding: 20px 32px;
  border-bottom: 1px solid var(--gray-border);
}

.client-row {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
}

.client-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--gray-text);
  min-width: 60px;
}

.client-value {
  font-size: 0.85rem;
  color: var(--black);
}

.public-table {
  width: 100%;
  border-collapse: collapse;
}

.public-table thead th {
  text-align: left;
  padding: 12px 32px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--gray-text);
  border-bottom: 1px solid var(--gray-border);
}

.public-table thead th:nth-child(2),
.public-table thead th:nth-child(3),
.public-table thead th:nth-child(4) {
  text-align: right;
}

.public-table tbody td {
  padding: 12px 32px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.public-table tbody td:nth-child(2),
.public-table tbody td:nth-child(3),
.public-table tbody td:nth-child(4) {
  text-align: right;
}

.public-table tbody tr:last-child td {
  border-bottom: none;
}

.public-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  border-top: 2px solid var(--black);
  font-size: 1.1rem;
  font-weight: 600;
}

.public-notes {
  padding: 16px 32px;
  font-size: 0.85rem;
  color: var(--gray-text);
  border-top: 1px solid var(--gray-border);
}

.public-actions {
  padding: 24px 32px;
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.action-btn.approve {
  background: #16a34a;
  color: white;
}

.action-btn.approve:hover {
  background: #15803d;
}

.action-btn.reject {
  background: var(--gray-light);
  color: var(--gray-text);
  border: 1px solid var(--gray-border);
}

.action-btn.reject:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}

.public-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.public-status.approved {
  background: #f0fdf4;
  color: #16a34a;
}

.public-status.rejected {
  background: #fef2f2;
  color: #dc2626;
}

.public-empty {
  text-align: center;
  padding: 80px 20px;
}

.public-empty h2 {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.public-empty p {
  color: var(--gray-text);
}

.public-footer {
  margin-top: 32px;
  font-size: 0.75rem;
  color: var(--gray-text);
}
</style>
