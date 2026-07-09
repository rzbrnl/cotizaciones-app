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
    if (!auth.currentUser) return

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
    }
  }

  async function updateClient(clientId, clientData) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    const { error } = await supabase
      .from('clients')
      .update(clientData)
      .eq('id', clientId)
      .eq('user_id', auth.currentUser.id)

    if (!error) {
      const index = clients.value.findIndex(c => c.id === clientId)
      if (index !== -1) {
        clients.value[index] = { ...clients.value[index], ...clientData }
      }
    }
  }

  async function deleteClient(clientId) {
    const auth = useAuthStore()
    if (!auth.currentUser) return

    await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', auth.currentUser.id)

    clients.value = clients.value.filter(c => c.id !== clientId)
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
