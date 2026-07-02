import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useUnsavedGuard(isDirty) {
  const router = useRouter()
  const confirmed = ref(false)

  function onBeforeUnload(e) {
    if (isDirty.value && !confirmed.value) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

  function confirmLeave() {
    confirmed.value = true
  }

  const originalPush = router.push
  const originalReplace = router.replace

  function patchRouter() {
    router.push = async (...args) => {
      if (isDirty.value && !confirmed.value) {
        const answer = window.confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')
        if (!answer) return
      }
      confirmed.value = true
      return originalPush(...args)
    }

    router.replace = async (...args) => {
      if (isDirty.value && !confirmed.value) {
        const answer = window.confirm('Tienes cambios sin guardar. ¿Salir de todas formas?')
        if (!answer) return
      }
      confirmed.value = true
      return originalReplace(...args)
    }
  }

  onMounted(() => {
    window.addEventListener('beforeunload', onBeforeUnload)
    patchRouter()
  })

  onUnmounted(() => {
    window.removeEventListener('beforeunload', onBeforeUnload)
    router.push = originalPush
    router.replace = originalReplace
  })

  return { confirmLeave }
}
