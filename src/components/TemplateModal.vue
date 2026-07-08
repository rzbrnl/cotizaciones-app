<template>
  <Teleport to="body">
    <div v-if="open" class="modal-overlay" @click.self="emit('close')">
      <div class="template-modal">
        <div class="template-header">
          <h3>Plantillas de cotización</h3>
          <button class="modal-close" @click="emit('close')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="template-body">
          <!-- Save new template -->
          <div class="save-template">
            <input
              v-model="newTemplateName"
              type="text"
              class="template-input"
              placeholder="Nombre de la plantilla"
            />
            <button class="btn-save" @click="handleSave" :disabled="!newTemplateName.trim()">
              Guardar
            </button>
          </div>

          <!-- Templates list -->
          <div class="templates-list">
            <div
              v-for="template in store.templates"
              :key="template.id"
              class="template-item"
              @click="handleLoad(template.id)"
            >
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-meta">
                  {{ template.data.eventType || 'Sin tipo' }} · {{ template.data.venue || 'Sin venue' }}
                </div>
              </div>
              <button class="template-delete" @click.stop="handleDelete(template.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
            <div v-if="store.templates.length === 0" class="template-empty">
              No tienes plantillas guardadas
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'load'])

const store = useQuotationStore()
const toast = useToastStore()
const newTemplateName = ref('')

async function handleSave() {
  if (!newTemplateName.value.trim()) return
  await store.saveTemplate(newTemplateName.value.trim())
  newTemplateName.value = ''
  toast.success('Plantilla guardada')
}

function handleLoad(templateId) {
  store.loadTemplate(templateId)
  emit('load')
  emit('close')
  toast.success('Plantilla cargada')
}

async function handleDelete(templateId) {
  await store.deleteTemplate(templateId)
  toast.success('Plantilla eliminada')
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

.template-modal {
  background: var(--white);
  border-radius: 16px;
  width: 90%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-border);
}

.template-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: var(--gray-text);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--gray-light);
  color: var(--black);
}

.template-body {
  padding: 20px 24px;
}

.save-template {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.template-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: 'Google Sans', sans-serif;
  outline: none;
}

.template-input:focus {
  border-color: var(--gold);
}

.btn-save {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #4a4a4a;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.templates-list {
  max-height: 300px;
  overflow-y: auto;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.template-item:hover {
  border-color: var(--gold);
  background: rgba(201, 168, 106, 0.04);
}

.template-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 2px;
}

.template-meta {
  font-size: 0.78rem;
  color: var(--gray-text);
}

.template-delete {
  background: none;
  border: none;
  color: #ccc;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-delete:hover {
  color: #e74c3c;
  background: #fef2f2;
}

.template-empty {
  text-align: center;
  padding: 32px;
  color: var(--gray-text);
  font-size: 0.9rem;
}
</style>
