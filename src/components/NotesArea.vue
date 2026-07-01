<template>
  <div class="notes-area">
    <label class="form-label">Notas / Observaciones</label>
    <textarea
      v-if="!readonly"
      class="notes-textarea"
      placeholder="Escribe tus notas aquí..."
      :value="notes"
      @input="emit('update', $event.target.value)"
      rows="5"
    ></textarea>
    <div v-else class="notes-display">{{ notes || '—' }}</div>
  </div>
</template>

<script setup>
defineProps({
  notes: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['update'])
</script>

<style scoped>
.notes-area {
  padding: 24px 48px 36px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
}

.notes-textarea {
  width: 100%;
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  color: var(--black);
  background: var(--white);
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
  line-height: 1.6;
}

.notes-textarea:focus {
  border-color: var(--gold);
}

.notes-textarea::placeholder {
  color: #ccc;
}

.notes-display {
  padding: 14px 0;
  font-size: 0.85rem;
  color: var(--gray-text);
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .notes-area {
    padding: 20px 24px 28px;
  }
}
</style>
