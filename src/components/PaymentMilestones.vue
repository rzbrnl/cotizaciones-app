<template>
  <div class="milestones-section">
    <div class="milestones-header">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <span>Etapas de pago</span>
    </div>

    <!-- Preset selector -->
    <div class="milestones-presets">
      <button
        v-for="preset in presets"
        :key="preset.value"
        class="preset-btn"
        :class="{ active: selectedPreset === preset.value }"
        @click="selectPreset(preset.value)"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Stages list -->
    <div class="stages-list">
      <div
        v-for="(stage, index) in stages"
        :key="stage.id"
        class="stage-item"
        :class="{ paid: stage.status === 'paid' }"
      >
        <div class="stage-info">
          <div class="stage-number">{{ index + 1 }}</div>
          <div class="stage-details">
            <div class="stage-label">{{ stage.label }}</div>
            <div class="stage-meta">
              <span class="stage-percent">{{ stage.percent }}%</span>
              <span v-if="stage.status === 'paid'" class="stage-paid-date">Pagado {{ formatDate(stage.paidAt) }}</span>
            </div>
          </div>
        </div>
        <div class="stage-right">
          <div class="stage-amount">{{ formatCurrency(stage.amount) }}</div>
          <button
            v-if="stage.status !== 'paid'"
            class="stage-mark-btn"
            @click="markAsPaid(stage.id)"
          >
            Marcar pagado
          </button>
          <span v-else class="stage-check">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="milestones-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ paidStages }} de {{ stages.length }} etapas pagadas
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatCurrency } from '../utils/format'

const props = defineProps({
  quotation: { type: Object, required: true },
  total: { type: Number, required: true },
})

const emit = defineEmits(['update:stages'])

const selectedPreset = ref('50-50')

const presets = [
  { value: '50-50', label: '50% / 50%' },
  { value: '30-30-40', label: '30% / 30% / 40%' },
  { value: '40-60', label: '40% / 60%' },
]

const stages = computed(() => {
  if (props.quotation.paymentStages && props.quotation.paymentStages.length > 0) {
    return props.quotation.paymentStages
  }
  return generateStages(selectedPreset.value)
})

function generateStages(preset) {
  const configs = {
    '50-50': [
      { label: 'Anticipo', percent: 50 },
      { label: 'Restante', percent: 50 },
    ],
    '30-30-40': [
      { label: 'Anticipo', percent: 30 },
      { label: 'Pago parcial', percent: 30 },
      { label: 'Pago final', percent: 40 },
    ],
    '40-60': [
      { label: 'Anticipo', percent: 40 },
      { label: 'Restante', percent: 60 },
    ],
  }

  return (configs[preset] || configs['50-50']).map((config, index) => ({
    id: `stage${index + 1}`,
    label: config.label,
    percent: config.percent,
    amount: Math.round(props.total * config.percent / 100),
    status: 'pending',
    paidAt: null,
  }))
}

function selectPreset(preset) {
  selectedPreset.value = preset
  emit('update:stages', generateStages(preset))
}

function markAsPaid(stageId) {
  const updated = stages.value.map(stage => {
    if (stage.id === stageId) {
      return { ...stage, status: 'paid', paidAt: new Date().toISOString() }
    }
    return stage
  })
  emit('update:stages', updated)
}

const paidStages = computed(() => {
  return stages.value.filter(s => s.status === 'paid').length
})

const progressPercent = computed(() => {
  if (stages.value.length === 0) return 0
  return (paidStages.value / stages.value.length) * 100
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.milestones-section {
  padding: 20px 24px;
  border-top: 1px solid var(--gray-border);
}

.milestones-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-text);
  font-size: 0.82rem;
  margin-bottom: 16px;
}

.milestones-presets {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.preset-btn {
  padding: 6px 12px;
  border: 1px solid var(--gray-border);
  border-radius: 20px;
  background: var(--white);
  font-size: 0.75rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--gray-text);
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  border-color: var(--gold);
}

.preset-btn.active {
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: #f7f7f7;
  border-radius: 10px;
  transition: all 0.2s;
}

.stage-item.paid {
  background: #f0fdf4;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gray-border);
  color: var(--gray-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.stage-item.paid .stage-number {
  background: #16a34a;
  color: white;
}

.stage-label {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--black);
}

.stage-meta {
  font-size: 0.75rem;
  color: var(--gray-text);
  display: flex;
  gap: 8px;
  align-items: center;
}

.stage-paid-date {
  color: #16a34a;
  font-weight: 500;
}

.stage-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stage-amount {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--black);
}

.stage-mark-btn {
  padding: 6px 12px;
  border: 1px solid var(--gray-border);
  border-radius: 6px;
  background: none;
  font-size: 0.75rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  cursor: pointer;
  transition: all 0.2s;
}

.stage-mark-btn:hover {
  background: var(--black);
  color: var(--white);
}

.stage-check {
  color: #16a34a;
}

.milestones-progress {
  margin-top: 16px;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #16a34a;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--gray-text);
}
</style>
