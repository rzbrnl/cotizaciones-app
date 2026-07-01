<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="emit('close')">
      <div class="share-modal">
        <div class="share-modal-header">
          <h3>Compartir cotización</h3>
          <button class="share-close" @click="emit('close')">
            <HIcon name="close" :size="20" />
          </button>
        </div>

        <!-- Opciones -->
        <div v-if="!activeOption" class="share-options">
          <div class="share-option" @click="selectOption('link')">
            <div class="share-option-icon link">
              <HIcon name="share" :size="20" />
            </div>
            <div class="share-option-text">
              <h4>Enlace compartible</h4>
              <p>Genera un enlace URL con la cotización</p>
            </div>
          </div>
          <div class="share-option" @click="selectOption('whatsapp')">
            <div class="share-option-icon whatsapp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div class="share-option-text">
              <h4>WhatsApp</h4>
              <p>Copia el mensaje formateado para WhatsApp</p>
            </div>
          </div>
          <div class="share-option" @click="generatePdf">
            <div class="share-option-icon pdf">
              <HIcon name="document" :size="20" />
            </div>
            <div class="share-option-text">
              <h4>Guardar PDF</h4>
              <p>Descarga la cotización como archivo PDF</p>
            </div>
          </div>
        </div>

        <!-- Resultado Enlace -->
        <div v-else-if="activeOption === 'link'" class="share-result">
          <p class="share-result-label">Copia este enlace y envíalo a tu cliente:</p>
          <div class="share-link-box">
            <input type="text" class="share-link-input" :value="shareUrl" readonly ref="linkInput" />
            <button class="share-link-copy" @click="copyLink">
              <HIcon name="copy" :size="16" v-if="!copied" />
              <span v-else>✓</span>
            </button>
          </div>
          <div class="share-result-actions">
            <button class="action-btn primary" @click="copyLink">{{ copied ? 'Copiado!' : 'Copiar enlace' }}</button>
            <button class="action-btn" @click="activeOption = null">Volver</button>
          </div>
        </div>

        <!-- Resultado WhatsApp -->
        <div v-else-if="activeOption === 'whatsapp'" class="share-result">
          <p class="share-result-label">Copia este mensaje y envíalo por WhatsApp:</p>
          <textarea class="share-textarea" :value="whatsappText" readonly ref="waInput" rows="12"></textarea>
          <div class="share-result-actions">
            <button class="action-btn primary" @click="copyWhatsApp">{{ copied ? 'Copiado!' : 'Copiar mensaje' }}</button>
            <button class="action-btn" @click="activeOption = null">Volver</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { formatCurrency } from '../utils/format'
import { compressToEncodedURIComponent } from 'lz-string'
import HIcon from './HIcon.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  quotation: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const auth = useAuthStore()
const activeOption = ref(null)
const copied = ref(false)
const linkInput = ref(null)
const waInput = ref(null)

const shareUrl = computed(() => {
  const json = JSON.stringify(props.quotation)
  const hash = compressToEncodedURIComponent(json)
  return `${window.location.origin}/compartir/${hash}`
})

const whatsappText = computed(() => {
  const q = props.quotation
  const lines = []
  lines.push(`✨ *Cotización*`)
  lines.push('')
  if (q.eventDate) lines.push(`📅 Fecha: ${q.eventDate}`)
  if (q.venue) lines.push(`📍 Venue: ${q.venue}`)
  if (q.eventType) lines.push(`📌 Tipo: ${q.eventType}`)
  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━')

  let total = 0
  for (const section of q.sections || []) {
    lines.push('')
    lines.push(`*${section.name}*`)
    for (const item of section.items || []) {
      const subtotal = (item.qty || 1) * (item.unitPrice || 0)
      total += subtotal
      lines.push(`• ${item.name || 'Sin nombre'} ×${item.qty || 1} — ${formatCurrency(subtotal)}`)
    }
  }

  lines.push('')
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━')
  lines.push(`💰 *TOTAL: ${formatCurrency(total)} MXN*`)

  if (q.notes) {
    lines.push('')
    lines.push(`📝 ${q.notes}`)
  }

  const userName = auth.profile?.full_name || auth.currentUser?.email || ''
  lines.push('')
  lines.push('Cordialmente,')
  lines.push(userName)

  return lines.join('\n')
})

function selectOption(option) {
  activeOption.value = option
  copied.value = false
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    linkInput.value?.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

async function copyWhatsApp() {
  try {
    await navigator.clipboard.writeText(whatsappText.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    waInput.value?.select()
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function generatePdf() {
  emit('close')
  setTimeout(() => window.print(), 300)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-modal {
  background: var(--white);
  border-radius: 16px;
  width: 90%;
  max-width: 460px;
  max-height: 85vh;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.share-modal-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--gray-border);
}

.share-modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.share-close {
  background: none;
  border: none;
  color: var(--gray-text);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.share-close:hover {
  background: var(--gray-light);
  color: var(--black);
}

/* Options */
.share-options {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.share-option:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 106, 0.06);
}

.share-option-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.share-option-icon.link { background: #f0fdf4; color: #16a34a; }
.share-option-icon.whatsapp { background: #f0fdf4; color: #16a34a; }
.share-option-icon.pdf { background: #fef2f2; color: #e74c3c; }

.share-option-text h4 {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 2px;
}

.share-option-text p {
  font-size: 0.78rem;
  color: var(--gray-text);
}

/* Result */
.share-result {
  padding: 20px 24px 24px;
}

.share-result-label {
  font-size: 0.85rem;
  color: var(--gray-text);
  margin-bottom: 12px;
}

.share-link-box {
  display: flex;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
}

.share-link-input {
  flex: 1;
  border: none;
  padding: 12px 14px;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  background: var(--gray-light);
  min-width: 0;
}

.share-link-copy {
  background: var(--gold);
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--black);
  font-weight: 600;
  transition: background 0.2s;
  flex-shrink: 0;
}

.share-link-copy:hover {
  background: var(--gold-hover);
}

.share-textarea {
  width: 100%;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  padding: 14px;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  resize: vertical;
  margin-bottom: 16px;
  line-height: 1.5;
}

.share-textarea:focus {
  border-color: var(--gold);
}

.share-result-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 11px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-border);
  background: var(--white);
  color: var(--black);
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.action-btn:hover {
  background: var(--gray-light);
}

.action-btn.primary {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--black);
  font-weight: 600;
}

.action-btn.primary:hover {
  background: var(--gold-hover);
}
</style>
