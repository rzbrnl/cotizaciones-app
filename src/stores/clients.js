import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

export const useClientsStore = defineStore('clients', () => {
  const clients = ref([])
  const loading = ref(false)

  async function loadClients() {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    loading.value = true
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', auth.currentUser.id)
      .order('created_at', { ascending: false })

    clients.value = data || []
    loading.value = false
  }

  async function addClient(clientData) {
    const auth = useAuthStore()
    if (!auth.currentUser) return null

    // Check for duplicate email
    if (clientData.email && clientData.email.trim()) {
      const { data: existing } = await supabase
        .from('clients')
        .select('id, name')
        .eq('user_id', auth.currentUser.id)
        .eq('email', clientData.email)
        .single()

      if (existing) {
        return { error: `Ya existe un cliente con el email ${clientData.email} (${existing.name})` }
      }
    }

    // Check for duplicate name
    const { data: nameExists } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', auth.currentUser.id)
      .eq('name', clientData.name)
      .single()

    if (nameExists) {
      return { error: `Ya existe un cliente con el nombre "${clientData.name}"` }
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: auth.currentUser.id,
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone || '',
        notes: clientData.notes || '',
      })
      .select()
      .single()

    if (!error) {
      clients.value.unshift(data)
      return { success: true }
    }
    return { error: error.message }
  }

  async function updateClient(clientId, clientData) {
    const auth = useAuthStore()
    if (!auth.currentUser) return false

    const { error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', clientId)
      .eq('user_id', auth.currentUser.id)

    if (error) {
      console.error('Error updating client:', error)
      return false
    }

    const index = clients.value.findIndex(c => c.id === clientId)
    if (index !== -1) {
      clients.value[index] = { ...clients.value[index], ...clientData }
    }
    return true
  }

  async function deleteClient(clientId) {
    const auth = useAuthStore()
    if (!auth.currentUser) return false

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', auth.currentUser.id)

    if (error) {
      console.error('Error deleting client:', error)
      return false
    }

    clients.value = clients.value.filter(c => c.id !== clientId)
    return true
  }

  async function getClientQuotations(clientId) {
    const auth = useAuthStore()
    if (!auth.currentUser) return []

    const { data } = await supabase
      .from('quotations')
      .select('*')
      .eq('user_id', auth.currentUser.id)

    if (!data) return []

    const client = clients.value.find(c => c.id === clientId)
    if (!client) return []

    return data
      .filter(q => q.data?.clientName === client.name)
      .map(q => ({ ...q.data, _dbId: q.id }))
  }

  function searchClients(query) {
    if (!query.trim()) return clients.value
    const q = query.toLowerCase()
    return clients.value.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.includes(q)
    )
  }

  return {
    clients,
    loading,
    loadClients,
    addClient,
    updateClient,
    deleteClient,
    getClientQuotations,
    searchClients,
  }
})
