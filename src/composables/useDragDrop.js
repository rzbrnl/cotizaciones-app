import { ref } from 'vue'

export function useDragDrop(items, onReorder) {
  const draggedIndex = ref(null)
  const dragOverIndex = ref(null)

  function onDragStart(index) {
    draggedIndex.value = index
  }

  function onDragOver(index) {
    if (draggedIndex.value === null) return
    dragOverIndex.value = index
  }

  function onDragEnd() {
    if (draggedIndex.value !== null && dragOverIndex.value !== null && draggedIndex.value !== dragOverIndex.value) {
      const list = [...items.value]
      const [moved] = list.splice(draggedIndex.value, 1)
      list.splice(dragOverIndex.value, 0, moved)
      onReorder(list)
    }
    draggedIndex.value = null
    dragOverIndex.value = null
  }

  function onDragLeave() {
    dragOverIndex.value = null
  }

  return {
    draggedIndex,
    dragOverIndex,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragLeave,
  }
}
