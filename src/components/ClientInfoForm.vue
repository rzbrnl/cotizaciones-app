<template>
  <div class="client-form">
    <!-- Fila 1: Nombre del cliente -->
    <div class="form-row">
      <div class="form-field">
        <label class="form-label">Nombre del cliente</label>
        <div class="input-wrap">
          <input
            v-if="!readonly"
            type="text"
            class="form-input"
            placeholder="Nombre del cliente"
            :value="data.clientName"
            @blur="emit('update:clientName', $event.target.value)"
            @keyup.enter="$event.target.blur()"
          />
          <span v-else class="form-display">{{ data.clientName || '—' }}</span>
          <span class="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Fila 2: Teléfono | Fecha del evento -->
    <div class="form-row form-row--two">
      <div class="form-field">
        <label class="form-label">Teléfono</label>
        <div class="input-wrap">
          <input
            v-if="!readonly"
            type="tel"
            class="form-input"
            placeholder="000 000 0000"
            :value="data.clientPhone"
            @blur="emit('update:clientPhone', $event.target.value)"
            @keyup.enter="$event.target.blur()"
          />
          <span v-else class="form-display">{{ data.clientPhone || '—' }}</span>
          <span class="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Fecha del evento</label>
        <div v-if="!readonly" class="input-wrap">
          <input
            type="date"
            class="form-input form-input--date"
            :value="data.eventDate"
            @input="emit('update:eventDate', $event.target.value)"
          />
          <span class="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
        </div>
        <span v-else class="form-display">{{ data.eventDate || '—' }}</span>
      </div>
    </div>

    <!-- Fila 3: Venue | Tipo de evento -->
    <div class="form-row form-row--two">
      <div class="form-field">
        <label class="form-label">Venue del evento</label>
        <div class="input-wrap">
          <input
            v-if="!readonly"
            type="text"
            class="form-input"
            placeholder="Lugar del evento"
            :value="data.venue"
            @blur="emit('update:venue', $event.target.value)"
            @keyup.enter="$event.target.blur()"
          />
          <span v-else class="form-display">{{ data.venue || '—' }}</span>
          <span class="input-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Tipo de evento</label>
        <div class="input-wrap">
          <select
            v-if="!readonly"
            class="form-input form-input--select"
            :value="data.eventType"
            @change="emit('update:eventType', $event.target.value)"
          >
            <option value="">Seleccionar...</option>
            <option value="Boda">Boda</option>
            <option value="XV Años">XV Años</option>
            <option value="Bautizo">Bautizo</option>
            <option value="Cumpleaños">Cumpleaños</option>
            <option value="Corporativo">Corporativo</option>
            <option value="Graduación">Graduación</option>
            <option value="Otro">Otro</option>
          </select>
          <span v-else class="form-display">{{ data.eventType || '—' }}</span>
          <span class="input-icon input-icon--select">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="3,4.5 6,7.5 9,4.5"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:clientName', 'update:clientPhone',
  'update:eventType', 'update:eventDate', 'update:venue',
])
</script>

<style scoped>
.client-form {
  padding: 28px 48px 24px;
  border-bottom: 1px solid var(--gray-border);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row--two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.form-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 11px 40px 11px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  color: var(--black);
  background: var(--white);
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
}

.form-input:focus {
  border-color: var(--gold);
}

.form-input::placeholder {
  color: #bbb;
}

.form-display {
  padding: 11px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-text);
  border: 1px solid transparent;
  border-radius: 8px;
  width: 100%;
}

.input-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 1;
}

/* Date picker */
.form-input--date {
  cursor: pointer;
  padding-right: 40px;
}

.form-input--date::-webkit-calendar-picker-indicator {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

/* Select */
.form-input--select {
  cursor: pointer;
  padding-right: 40px;
  background-image: none;
}

.input-icon--select {
  z-index: 2;
  pointer-events: auto;
}

@media (max-width: 600px) {
  .client-form {
    padding: 20px 24px 16px;
  }
  .form-row--two {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
