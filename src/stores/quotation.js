import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function createBlank() {
  return {
    id: generateId(),
    title: 'Cotización',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
    clientName: '',
    clientPhone: '',
    eventType: '',
    eventDate: '',
    venue: '',
    notes: '',
    sections: [
      {
        id: generateId(),
        name: 'Sección',
        items: [{ id: generateId(), name: '', qty: 1, unitPrice: 0 }],
      },
    ],
  }
}

export const useQuotationStore = defineStore('quotation', () => {
  const active = ref(createBlank())
  const savedList = ref([])
  const saving = ref(false)

  const grandTotal = computed(() => {
    let total = 0
    for (const section of active.value.sections) {
      for (const item of section.items) {
        total += (item.qty || 0) * (item.unitPrice || 0)
      }
    }
    return total
  })

  function createNew() {
    active.value = createBlank()
  }

  async function loadAll() {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const { data } = await supabase
      .from('quotations')
      .select('*')
      .eq('user_id', auth.currentUser.id)
      .order('created_at', { ascending: false })

    savedList.value = (data || []).map(q => ({
      ...q.data,
      _dbId: q.id,
    }))
  }

  async function loadById(id) {
    const found = savedList.value.find(q => q.id === id)
    if (found) {
      active.value = JSON.parse(JSON.stringify(found))
      return true
    }
    return false
  }

  async function save() {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    saving.value = true
    const copy = JSON.parse(JSON.stringify(active.value))

    const existing = savedList.value.find(q => q.id === copy.id)

    if (existing?._dbId) {
      await supabase
        .from('quotations')
        .update({ data: copy, updated_at: new Date().toISOString() })
        .eq('id', existing._dbId)
    } else {
      const { data } = await supabase
        .from('quotations')
        .insert({
          user_id: auth.currentUser.id,
          data: copy,
        })
        .select()
        .single()

      if (data) {
        copy._dbId = data.id
      }
    }

    await loadAll()
    saving.value = false
  }

  async function deleteById(id) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const found = savedList.value.find(q => q.id === id)
    if (found?._dbId) {
      await supabase
        .from('quotations')
        .delete()
        .eq('id', found._dbId)
    }

    await loadAll()
  }

  function addItem(sectionId, product) {
    const section = active.value.sections.find(s => s.id === sectionId)
    if (!section) return
    section.items.push({
      id: generateId(),
      name: product?.name || '',
      qty: 1,
      unitPrice: product?.defaultPrice || product?.unitPrice || 0,
    })
  }

  function removeItem(sectionId, itemId) {
    const section = active.value.sections.find(s => s.id === sectionId)
    if (!section) return
    if (section.items.length <= 1) {
      removeSection(sectionId)
      return
    }
    section.items = section.items.filter(i => i.id !== itemId)
  }

  function addSection() {
    active.value.sections.push({
      id: generateId(),
      name: 'Nueva Sección',
      items: [{ id: generateId(), name: '', qty: 1, unitPrice: 0 }],
    })
  }

  function removeSection(sectionId) {
    if (active.value.sections.length <= 1) return
    active.value.sections = active.value.sections.filter(s => s.id !== sectionId)
  }

  return {
    active,
    savedList,
    saving,
    grandTotal,
    createNew,
    loadAll,
    loadById,
    save,
    deleteById,
    addItem,
    removeItem,
    addSection,
    removeSection,
  }
})
