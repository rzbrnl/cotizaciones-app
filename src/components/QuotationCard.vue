<template>
  <div class="quote-card" @click="emit('edit', quotation.id)">
    <div class="quote-card-body">
      <div class="quote-card-info">
        <div class="quote-card-top">
          <div class="quote-card-name">{{ quotation.clientName || 'Sin cliente' }}</div>
          <span class="status-badge" :class="quotation.status || 'borrador'">
            {{ statusLabel }}
          </span>
          <span v-if="paymentBadge" class="payment-badge" :class="paymentBadge">
            {{ paymentBadgeLabel }}
          </span>
        </div>
        <div class="quote-card-venue">{{ quotation.venue || 'Sin venue' }}</div>
        <div class="quote-card-date">{{ quotation.eventDate || quotation.date }}</div>
      </div>
      <div class="quote-card-price">{{ formatCurrency(total) }}</div>
    </div>
    <div v-if="paymentBadge && paymentsTotal > 0" class="quote-card-payment">
      <div class="payment-progress-bar">
        <div class="payment-progress-fill" :style="{ width: paymentPercent + '%' }"></div>
      </div>
      <div class="payment-progress-text">
        {{ formatCurrency(paymentsTotal) }} de {{ formatCurrency(total) }}
      </div>
    </div>
    <div class="quote-card-actions">
      <button class="quote-action duplicate" @click.stop="emit('duplicate', quotation.id)" title="Duplicar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button class="quote-action view" @click.stop="emit('edit', quotation.id)" title="Ver">
        <HIcon name="eye" :size="18" />
      </button>
      <button class="quote-action delete" @click.stop="emit('delete', quotation.id)" title="Eliminar">
        <HIcon name="trash" :size="18" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'
import HIcon from './HIcon.vue'

const props = defineProps({
  quotation: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete', 'duplicate'])

const statusLabels = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
}

const statusLabel = computed(() => statusLabels[props.quotation.status] || 'Borrador')

const paymentLabels = {
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  pagado: 'Pagado',
}

const paymentBadge = computed(() => {
  if (props.quotation.status !== 'aprobada') return null
  return props.quotation.paymentStatus || 'pendiente'
})

const paymentBadgeLabel = computed(() => paymentLabels[paymentBadge.value] || 'Pendiente')

const total = computed(() => {
  let t = 0
  for (const section of props.quotation.sections || []) {
    for (const item of section.items || []) {
      t += (item.qty || 0) * (item.unitPrice || 0)
    }
  }
  return t
})

const paymentsTotal = computed(() => {
  return (props.quotation.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
})

const paymentPercent = computed(() => {
  if (total.value === 0) return 0
  return Math.min(100, (paymentsTotal.value / total.value) * 100)
})
</script>

<style scoped>
.quote-card {
  background: #f7f7f7;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.quote-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.quote-card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.quote-card-info {
  flex: 1;
  min-width: 0;
}

.quote-card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.quote-card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--black);
}

.quote-card-venue {
  font-size: 0.8rem;
  color: var(--gray-text);
  margin-bottom: 4px;
}

.quote-card-date {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #999;
}

.quote-card-payment {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.payment-progress-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.payment-progress-fill {
  height: 100%;
  background: #16a34a;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.payment-progress-text {
  font-size: 0.7rem;
  color: #16a34a;
  font-weight: 500;
}

.quote-card-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gold);
  white-space: nowrap;
}

/* Status badges */
.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
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

/* Payment badges */
.payment-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.payment-badge.pendiente {
  background: #fef3c7;
  color: #d97706;
}

.payment-badge.parcial {
  background: #dbeafe;
  color: #2563eb;
}

.payment-badge.pagado {
  background: #dcfce7;
  color: #16a34a;
}

.quote-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}

.quote-card:hover .quote-card-actions {
  opacity: 1;
}

.quote-action {
  background: none;
  border: none;
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.quote-action.duplicate {
  color: #888;
}

.quote-action.duplicate:hover {
  color: var(--black);
  background: rgba(0,0,0,0.06);
}

.quote-action.view {
  color: #888;
}

.quote-action.view:hover {
  color: var(--black);
  background: rgba(0,0,0,0.06);
}

.quote-action.delete {
  color: #ccc;
}

.quote-action.delete:hover {
  color: #e74c3c;
  background: #fef2f2;
}
</style>
