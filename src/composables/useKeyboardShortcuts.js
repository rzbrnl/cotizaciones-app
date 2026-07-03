import { onMounted, onUnmounted } from 'vue'

export function useKeyboardShortcuts(shortcuts) {
  function handleKeydown(e) {
    for (const shortcut of shortcuts) {
      const ctrl = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true
      const shift = shortcut.shift ? e.shiftKey : true
      const key = e.key.toLowerCase()

      if (ctrl && shift && key === shortcut.key) {
        e.preventDefault()
        shortcut.handler()
        return
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
