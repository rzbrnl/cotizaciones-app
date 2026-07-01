<template>
  <div class="grand-total">
    <span class="total-label">Total</span>
    <span class="total-amount">{{ formatCurrency(total) }} MXN</span>
  </div>
</template>

<script setup>
import { formatCurrency } from '../utils/format'

defineProps({
  total: { type: Number, required: true },
})
</script>

<style scoped>
.grand-total {
  padding: 28px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid var(--black);
  border-bottom: 2px solid var(--black);
  margin: 8px 0 0;
}

.total-label {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.total-amount {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 400;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 600px) {
  .grand-total {
    padding: 20px 24px;
  }
  .total-label,
  .total-amount {
    font-size: 1.3rem;
  }
}
</style>
