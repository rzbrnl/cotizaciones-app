<template>
  <tr :data-item-id="item.id" class="item-row">
    <td class="item-name">
      <div v-if="!readonly" class="item-input-wrap">
        <input
          type="text"
          class="item-input"
          placeholder="Nombre del concepto"
          :value="item.name"
          @input="emit('update', 'name', $event.target.value)"
          @blur="emit('update', 'name', $event.target.value)"
        />
      </div>
      <span v-else>{{ item.name || '—' }}</span>
    </td>
    <td class="item-qty">
      <div v-if="!readonly" class="qty-stepper">
        <button class="qty-btn" @click="changeQty(-1)">−</button>
        <input
          type="number"
          class="qty-input"
          :value="item.qty"
          min="1"
          @input="emit('update', 'qty', $event.target.value)"
          @blur="emit('update', 'qty', $event.target.value)"
        />
        <button class="qty-btn" @click="changeQty(1)">+</button>
      </div>
      <span v-else>{{ item.qty }}</span>
    </td>
    <td class="item-cost">
      <div v-if="!readonly" class="item-input-wrap item-input-wrap--small">
        <span class="item-currency">$</span>
        <input
          type="text"
          class="item-input item-input--right"
          :value="formatNumber(item.unitPrice)"
          @blur="emit('update', 'unitPrice', $event.target.value)"
          @keyup.enter="$event.target.blur()"
        />
      </div>
      <span v-else>{{ formatCurrency(item.unitPrice) }}</span>
    </td>
    <td class="item-subtotal">{{ formatCurrency(subtotal) }}</td>
    <td class="row-actions no-print" v-if="!readonly">
      <button class="remove-btn-sm" @click="emit('remove')">&times;</button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/format'

const props = defineProps({
  item: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update', 'remove'])

const subtotal = computed(() => (props.item.qty || 0) * (props.item.unitPrice || 0))

function formatNumber(num) {
  return Number(num || 0).toLocaleString('en-US')
}

function changeQty(delta) {
  const newQty = Math.max(1, (props.item.qty || 1) + delta)
  emit('update', 'qty', String(newQty))
}
</script>

<style scoped>
.item-row {
  transition: background 0.15s;
}

.item-row:hover {
  background: rgba(201, 169, 110, 0.04);
}

.item-name {
  padding: 10px 8px 10px 0;
  vertical-align: middle;
}

.item-qty,
.item-cost {
  text-align: right;
  padding: 10px 8px;
  vertical-align: middle;
}

.item-subtotal {
  text-align: right;
  padding: 10px 8px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  vertical-align: middle;
}

/* Input wraps */
.item-input-wrap {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--white);
  transition: border-color 0.2s;
}

.item-input-wrap:focus-within {
  border-color: var(--gold);
}

.item-input-wrap--small {
  max-width: 110px;
}

.item-input {
  border: none;
  outline: none;
  padding: 8px 10px;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  background: transparent;
  width: 100%;
}

.item-input--right {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.item-input::placeholder {
  color: #ccc;
}

.item-currency {
  padding-left: 10px;
  color: var(--gray-text);
  font-size: 0.82rem;
  font-weight: 500;
}

/* Quantity stepper */
.qty-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--white);
}

.qty-btn {
  width: 30px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--gray-text);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.qty-btn:hover {
  background: var(--gray-light);
  color: var(--black);
}

.qty-input {
  width: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--gray-border);
  border-right: 1px solid var(--gray-border);
  outline: none;
  padding: 6px 0;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  background: transparent;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove button */
.remove-btn-sm {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 6px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.15s;
}

.item-row:hover .remove-btn-sm {
  opacity: 1;
}

.remove-btn-sm:hover {
  color: var(--danger);
  background: #fee;
}

/* Readonly state */
td span {
  font-size: 0.82rem;
  color: var(--gray-text);
}
</style>
