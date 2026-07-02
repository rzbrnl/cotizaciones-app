import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfirmStore = defineStore('confirm', () => {
  const open = ref(false)
  const title = ref('')
  const message = ref('')
  const confirmText = ref('Confirmar')
  const cancelText = ref('Cancelar')
  const type = ref('warning')
  let resolvePromise = null

  function show(options = {}) {
    title.value = options.title || '¿Estás seguro?'
    message.value = options.message || ''
    confirmText.value = options.confirmText || 'Confirmar'
    cancelText.value = options.cancelText || 'Cancelar'
    type.value = options.type || 'warning'
    open.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  function confirm() {
    open.value = false
    resolvePromise?.(true)
    resolvePromise = null
  }

  function cancel() {
    open.value = false
    resolvePromise?.(false)
    resolvePromise = null
  }

  return { open, title, message, confirmText, cancelText, type, show, confirm, cancel }
})
