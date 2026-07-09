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
    status: 'borrador',
    paymentStatus: 'pendiente',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventType: '',
    eventDate: '',
    venue: '',
    notes: '',
    reminderDate: '',
    reminderNote: '',
    payments: [],
    paymentStages: [],
    createdAt: new Date().toISOString(),
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

  const pendingReminders = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return savedList.value.filter(q =>
      q.reminderDate && q.reminderDate <= today && q.status !== 'aprobada' && q.status !== 'rechazada'
    )
  })

  const metrics = computed(() => {
    const list = savedList.value
    const total = list.length
    const borradores = list.filter(q => (q.status || 'borrador') === 'borrador').length
    const enviadas = list.filter(q => q.status === 'enviada').length
    const aprobadas = list.filter(q => q.status === 'aprobada').length
    const rechazadas = list.filter(q => q.status === 'rechazada').length

    let totalRevenue = 0
    for (const q of aprobadas_list(list)) {
      for (const s of q.sections || []) {
        for (const i of s.items || []) {
          totalRevenue += (i.qty || 0) * (i.unitPrice || 0)
        }
      }
    }

    const approvalRate = total > 0 ? Math.round((aprobadas / total) * 100) : 0

    return { total, borradores, enviadas, aprobadas, rechazadas, totalRevenue, approvalRate }
  })

  function aprobadas_list(list) {
    return list.filter(q => q.status === 'aprobada')
  }

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
      // Ensure ownerEmail exists for old quotations
      if (!active.value.ownerEmail && auth.currentUser?.email) {
        active.value.ownerEmail = auth.currentUser.email
      }
      return true
    }
    return false
  }

  async function save() {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    saving.value = true
    active.value.ownerEmail = auth.currentUser.email
    active.value.ownerLogo = auth.userLogo
    active.value.ownerId = auth.currentUser.id

    // Auto-save client if clientName exists
    if (active.value.clientName && active.value.clientName.trim()) {
      // Check if client exists by email first
      let existingClient = null
      if (active.value.clientEmail && active.value.clientEmail.trim()) {
        const { data } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', auth.currentUser.id)
          .eq('email', active.value.clientEmail)
          .single()
        existingClient = data
      }

      // If not found by email, check by name
      if (!existingClient) {
        const { data } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', auth.currentUser.id)
          .eq('name', active.value.clientName)
          .single()
        existingClient = data
      }

      if (!existingClient) {
        // Create new client
        await supabase.from('clients').insert({
          user_id: auth.currentUser.id,
          name: active.value.clientName,
          email: active.value.clientEmail || '',
          phone: active.value.clientPhone || '',
        })
      }
    }

    const copy = JSON.parse(JSON.stringify(active.value))

    const existing = savedList.value.find(q => q.id === copy.id)

    if (existing?._dbId) {
      await supabase
        .from('quotations')
        .update({ data: copy, updated_at: new Date().toISOString() })
        .eq('id', existing._dbId)
      active.value._dbId = existing._dbId
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
        active.value._dbId = data.id
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

  async function updateStatus(quotationId, newStatus) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const found = savedList.value.find(q => q.id === quotationId)
    if (found) {
      found.status = newStatus
    }

    if (found?._dbId) {
      await supabase
        .from('quotations')
        .update({ data: { ...found, status: newStatus } })
        .eq('id', found._dbId)
    }

    if (active.value.id === quotationId) {
      active.value.status = newStatus
    }
  }

  function getQuotationTotal(quotation) {
    let total = 0
    for (const s of quotation.sections || []) {
      for (const i of s.items || []) {
        total += (i.qty || 0) * (i.unitPrice || 0)
      }
    }
    return total
  }

  function getPaymentsTotal(quotation) {
    return (quotation.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0)
  }

  function getPaymentStatus(quotation) {
    const total = getQuotationTotal(quotation)
    const paid = getPaymentsTotal(quotation)
    if (paid === 0) return 'pendiente'
    if (paid >= total) return 'pagado'
    return 'parcial'
  }

  async function addPayment(quotationId, amount, note) {
    const found = savedList.value.find(q => q.id === quotationId)
    if (!found) return

    // Validate payment amount
    const total = getQuotationTotal(found)
    const paid = getPaymentsTotal(found)
    const remaining = total - paid
    const paymentAmount = parseFloat(amount)

    if (!paymentAmount || paymentAmount <= 0) return false
    if (paymentAmount > remaining) return false

    if (!found.payments) found.payments = []
    found.payments.push({
      id: generateId(),
      amount: paymentAmount,
      note: note || '',
      date: new Date().toISOString(),
    })

    found.paymentStatus = getPaymentStatus(found)

    if (found._dbId) {
      await supabase
        .from('quotations')
        .update({ data: found })
        .eq('id', found._dbId)
    }

    if (active.value.id === quotationId) {
      active.value.payments = [...found.payments]
      active.value.paymentStatus = found.paymentStatus
    }

    return true
  }

  function duplicate(quotationId) {
    const original = savedList.value.find(q => q.id === quotationId)
    if (!original) return null

    const copy = JSON.parse(JSON.stringify(original))
    copy.id = generateId()
    copy.title = original.title + ' (copia)'
    copy.status = 'borrador'
    copy.date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()
    copy.clientName = original.clientName
    copy.clientPhone = original.clientPhone
    copy.eventType = original.eventType
    copy.eventDate = original.eventDate
    copy.venue = original.venue
    copy.notes = original.notes
    copy.reminderDate = ''
    copy.reminderNote = ''
    copy.createdAt = new Date().toISOString()
    copy._dbId = null

    copy.sections = original.sections.map(s => ({
      id: generateId(),
      name: s.name,
      items: s.items.map(i => ({
        id: generateId(),
        name: i.name,
        qty: i.qty,
        unitPrice: i.unitPrice,
      })),
    }))

    return copy
  }

  function updatePaymentStages(stages) {
    active.value.paymentStages = stages
  }

  // Templates
  const templates = ref([])

  async function loadTemplates() {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const { data } = await supabase
      .from('quotation_templates')
      .select('*')
      .eq('user_id', auth.currentUser.id)
      .order('created_at', { ascending: false })

    templates.value = data || []
  }

  async function saveTemplate(name) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const templateData = {
      name,
      eventType: active.value.eventType,
      venue: active.value.venue,
      sections: active.value.sections,
      notes: active.value.notes,
      paymentStages: active.value.paymentStages,
    }

    const { data, error } = await supabase
      .from('quotation_templates')
      .insert({
        user_id: auth.currentUser.id,
        name,
        data: templateData,
      })
      .select()
      .single()

    if (!error) {
      templates.value.unshift(data)
    }
  }

  async function loadTemplate(templateId) {
    const template = templates.value.find(t => t.id === templateId)
    if (!template) return

    active.value.eventType = template.data.eventType || ''
    active.value.venue = template.data.venue || ''
    active.value.sections = template.data.sections || [{ id: generateId(), name: 'Sección', items: [{ id: generateId(), name: '', qty: 1, unitPrice: 0 }] }]
    active.value.notes = template.data.notes || ''
    active.value.paymentStages = template.data.paymentStages || []
  }

  async function deleteTemplate(templateId) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    await supabase
      .from('quotation_templates')
      .delete()
      .eq('id', templateId)
      .eq('user_id', auth.currentUser.id)

    templates.value = templates.value.filter(t => t.id !== templateId)
  }

  return {
    active,
    savedList,
    saving,
    templates,
    grandTotal,
    pendingReminders,
    metrics,
    createNew,
    loadAll,
    loadById,
    save,
    deleteById,
    addItem,
    removeItem,
    addSection,
    removeSection,
    updateStatus,
    duplicate,
    getQuotationTotal,
    getPaymentsTotal,
    getPaymentStatus,
    addPayment,
    updatePaymentStages,
    loadTemplates,
    saveTemplate,
    loadTemplate,
    deleteTemplate,
  }
})
