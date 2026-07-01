<template>
  <div class="section-block">
    <div class="section-header">
      <div
        class="section-title"
        :contenteditable="!readonly"
        @blur="emit('updateName', $event.target.textContent)"
      >{{ section.name }}</div>
      <button v-if="!readonly" class="section-remove no-print" @click="emit('remove')">&times;</button>
    </div>

    <table class="item-table">
      <thead>
        <tr>
          <th class="th-concept">Concepto</th>
          <th class="th-qty">Cantidad</th>
          <th class="th-price">Precio</th>
          <th class="th-subtotal">Subtotal</th>
          <th v-if="!readonly" class="th-actions no-print"></th>
        </tr>
      </thead>
      <tbody>
        <ItemRow
          v-for="item in section.items"
          :key="item.id"
          :item="item"
          :readonly="readonly"
          @update="(field, value) => emit('updateItem', item.id, field, value)"
          @remove="emit('removeItem', item.id)"
        />
      </tbody>
    </table>

    <div v-if="!readonly" class="section-add no-print">
      <button class="btn-add-dark" @click="emit('addItem')">Agregar concepto</button>
    </div>

    <div class="section-total">
      <span class="section-total-label">Total sección</span>
      <span class="section-total-value">{{ formatCurrency(total) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'
import ItemRow from './ItemRow.vue'

const props = defineProps({
  section: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['updateName', 'addItem', 'removeItem', 'remove'])

const total = computed(() => {
  let t = 0
  for (const item of props.section.items) {
    t += (item.qty || 0) * (item.unitPrice || 0)
  }
  return t
})
</script>

<style scoped>
.section-block {
  padding: 0 48px;
  margin-top: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Google Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--black);
  outline: none;
  padding: 4px 8px;
  border: 1px dashed transparent;
  border-radius: 4px;
  transition: all 0.2s;
}

.section-title:hover {
  border-color: var(--gray-border);
  background: var(--gray-light);
}

.section-title:focus {
  border-color: var(--gold);
  background: var(--gold-light);
}

.section-remove {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.section-remove:hover {
  color: var(--danger);
  background: #fee;
}

/* Table */
.item-table {
  width: 100%;
  border-collapse: collapse;
}

.item-table thead th {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
  padding: 0 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--gray-border);
}

.th-concept { width: 45%; }
.th-qty { width: 15%; text-align: center; }
.th-price { width: 18%; text-align: right; }
.th-subtotal { width: 18%; text-align: right; }
.th-actions { width: 4%; }

.item-table tbody td {
  border-bottom: 1px solid var(--gray-border);
}

/* Add button */
.section-add {
  padding: 14px 0;
}

.btn-add-dark {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.btn-add-dark:hover {
  background: #333;
}

/* Section total */
.section-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-top: 1px solid var(--gray-border);
}

.section-total-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
}

.section-total-value {
  font-size: 0.95rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 600px) {
  .section-block {
    padding: 0 24px;
  }
}
</style>
