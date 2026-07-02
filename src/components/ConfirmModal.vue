<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="confirm-overlay" @click.self="cancel">
        <div class="confirm-card">
          <div class="confirm-icon" :class="type">
            <svg v-if="type === 'warning'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="confirm-title">{{ title }}</h3>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button class="confirm-btn cancel" @click="cancel">{{ cancelText }}</button>
            <button class="confirm-btn proceed" :class="type" @click="confirm">{{ confirmText }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '¿Estás seguro?' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'Confirmar' },
  cancelText: { type: String, default: 'Cancelar' },
  type: { type: String, default: 'warning' },
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.confirm-card {
  background: var(--white);
  border-radius: 16px;
  padding: 32px;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.confirm-icon.warning {
  background: #fef3c7;
  color: #d97706;
}

.confirm-icon.danger {
  background: #fee2e2;
  color: #dc2626;
}

.confirm-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 8px;
}

.confirm-message {
  font-size: 0.88rem;
  color: var(--gray-text);
  line-height: 1.5;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 10px;
}

.confirm-btn {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.confirm-btn.cancel {
  background: var(--gray-light);
  color: var(--black);
  border: 1px solid var(--gray-border);
}

.confirm-btn.cancel:hover {
  background: #e5e5e5;
}

.confirm-btn.proceed.warning {
  background: #d97706;
  color: white;
}

.confirm-btn.proceed.warning:hover {
  background: #b45309;
}

.confirm-btn.proceed.danger {
  background: #dc2626;
  color: white;
}

.confirm-btn.proceed.danger:hover {
  background: #b91c1c;
}

/* Transition */
.modal-enter-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .confirm-card {
  animation: modal-in 0.25s ease;
}
@keyframes modal-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
