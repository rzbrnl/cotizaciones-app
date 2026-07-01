<template>
  <div class="quotation-card" @click="emit('edit', quotation.id)">
    <div class="quotation-card-total">{{ formatCurrency(total) }}</div>
    <div class="quotation-card-client">{{ quotation.clientName || 'Sin cliente' }}</div>
    <div class="quotation-card-event">{{ quotation.venue || quotation.eventType || '' }}</div>
    <div class="quotation-card-date">{{ quotation.eventDate || quotation.date }}</div>
    <button class="quotation-card-delete" @click.stop="emit('delete', quotation.id)">🗑</button>
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
