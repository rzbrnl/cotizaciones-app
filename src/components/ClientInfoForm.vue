<template>
  <div class="client-form">
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
          <span v-else class="form-display">{{ data.clientName || "—" }}</span>
          <span class="input-icon"><HIcon name="user" :size="16" /></span>
        </div>
      </div>
    </div>

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
          <span v-else class="form-display">{{ data.clientPhone || "—" }}</span>
          <span class="input-icon"><HIcon name="phone" :size="16" /></span>
        </div>
      </div>
      <div class="form-field">
        <label class="form-label">Email del cliente</label>
        <div class="input-wrap">
          <input
            v-if="!readonly"
            type="email"
            class="form-input"
            placeholder="correo@ejemplo.com"
            :value="data.clientEmail"
            @blur="emit('update:clientEmail', $event.target.value)"
            @keyup.enter="$event.target.blur()"
          />
          <span v-else class="form-display">{{ data.clientEmail || "—" }}</span>
          <span class="input-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
        </div>
      </div>
    </div>

    <div class="form-row form-row--two">
      <div class="form-field">
        <label class="form-label">Fecha del evento</label>
        <div v-if="!readonly" class="input-wrap">
          <input
            type="date"
            class="form-input form-input--date"
            :value="data.eventDate"
            @input="emit('update:eventDate', $event.target.value)"
          />
          <span class="input-icon"><HIcon name="calendar" :size="16" /></span>
        </div>
        <span v-else class="form-display">{{ data.eventDate || "—" }}</span>
      </div>
    </div>

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
          <span v-else class="form-display">{{ data.venue || "—" }}</span>
          <span class="input-icon"><HIcon name="location" :size="16" /></span>
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
          <span v-else class="form-display">{{ data.eventType || "—" }}</span>
          <span class="input-icon input-icon--select"
            ><HIcon name="chevron-down" :size="14"
          /></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HIcon from "./HIcon.vue";

defineProps({
  data: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
});

const emit = defineEmits([
  "update:clientName",
  "update:clientPhone",
  "update:clientEmail",
  "update:eventType",
  "update:eventDate",
  "update:venue",
]);
</script>

<style scoped>
.client-form {
  padding: 28px 40px 24px;
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
  font-family: "Google Sans", sans-serif;
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
