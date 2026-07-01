<template>
  <div class="quote-card" @click="emit('edit', quotation.id)">
    <div class="quote-card-body">
      <div class="quote-card-info">
        <div class="quote-card-name">{{ quotation.clientName || 'Sin cliente' }}</div>
        <div class="quote-card-venue">{{ quotation.venue || 'Sin venue' }}</div>
        <div class="quote-card-date">{{ quotation.eventDate || quotation.date }}</div>
      </div>
      <div class="quote-card-price">{{ formatCurrency(total) }}</div>
    </div>
    <div class="quote-card-actions">
      <button class="quote-action view" @click.stop="emit('edit', quotation.id)" title="Ver">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </button>
      <button class="quote-action delete" @click.stop="emit('delete', quotation.id)" title="Eliminar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'

const props = defineProps({
  quotation: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])

const total = computed(() => {
  let t = 0
  for (const section of props.quotation.sections || []) {
    for (const item of section.items || []) {
      t += (item.qty || 0) * (item.unitPrice || 0)
    }
  }
  return t
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

.quote-card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 2px;
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

.quote-card-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gold);
  white-space: nowrap;
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
