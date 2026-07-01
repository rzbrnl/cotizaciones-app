<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="emit('close')">
      <div class="share-modal">
        <div class="share-modal-header">
          <h3>Compartir cotización</h3>
          <button @click="emit('close')">&times;</button>
        </div>

        <div v-if="!activeOption" class="share-options">
          <div class="share-option" @click="selectOption('link')">
            <div class="share-option-icon link">🔗</div>
            <div class="share-option-text">
              <h4>Enlace compartible</h4>
              <p>Genera un enlace URL con la cotización</p>
            </div>
          </div>
          <div class="share-option" @click="selectOption('whatsapp')">
            <div class="share-option-icon whatsapp">💬</div>
            <div class="share-option-text">
              <h4>WhatsApp</h4>
              <p>Copia el mensaje formateado para WhatsApp</p>
            </div>
          </div>
          <div class="share-option" @click="selectOption('email')">
            <div class="share-option-icon email">✉️</div>
            <div class="share-option-text">
              <h4>Email</h4>
              <p>Copia el HTML de la cotización para tu cliente de email</p>
            </div>
          </div>
          <div class="share-option" @click="printPdf">
            <div class="share-option-icon pdf">📄</div>
            <div class="share-option-text">
              <h4>Imprimir / PDF</h4>
              <p>Exporta como PDF desde el navegador</p>
            </div>
          </div>
        </div>

        <div v-else class="share-result">
          <p style="font-size:0.8rem;color:var(--gray-text);margin-bottom:10px;">
            {{ resultLabel }}
          </p>
          <textarea :value="resultText" readonly ref="resultTextarea" />
          <div class="share-result-actions">
            <button class="toolbar-btn primary" @click="copyResult">
              {{ copied ? 'Copiado!' : 'Copiar' }}
            </button>
            <button v-if="activeOption === 'link'" class="toolbar-btn" @click="openLink">
              Abrir enlace
            </button>
            <button class="toolbar-btn" @click="activeOption = null">Volver</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { generateShareUrl, generateWhatsAppText, generateEmailHtml, copyToClipboard } from '../utils/share'

const props = defineProps({
  open: { type: Boolean, default: false },
  quotation: { type: Object, required: true },
})

const emit = defineEmits(['close'])

const activeOption = ref(null)
const copied = ref(false)
const resultTextarea = ref(null)

const baseUrl = computed(() => window.location.origin)

const resultText = computed(() => {
  if (activeOption.value === 'link') {
    return generateShareUrl(props.quotation, baseUrl.value)
  }
  if (activeOption.value === 'whatsapp') {
    return generateWhatsAppText(props.quotation)
  }
  if (activeOption.value === 'email') {
    return generateEmailHtml(props.quotation)
  }
  return ''
})

const resultLabel = computed(() => {
  if (activeOption.value === 'link') return 'Copia este enlace y envíalo a tu cliente:'
  if (activeOption.value === 'whatsapp') return 'Copia este mensaje y pégalo en WhatsApp:'
  if (activeOption.value === 'email') return 'Copia este HTML y pégalo en el cuerpo de tu email:'
  return ''
})

function selectOption(option) {
  activeOption.value = option
  copied.value = false
}

async function copyResult() {
  await copyToClipboard(resultText.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function openLink() {
  window.open(resultText.value, '_blank')
}

function printPdf() {
  emit('close')
  setTimeout(() => window.print(), 300)
}
</script>
