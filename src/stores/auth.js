import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const profile = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!currentUser.value)
  const userLogo = computed(() => profile.value?.logo_url || '')

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      currentUser.value = session.user
      await fetchProfile(session.user.id)
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        currentUser.value = session.user
        await fetchProfile(session.user.id)
      } else {
        currentUser.value = null
        profile.value = null
      }
    })

    loading.value = false
  }

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return
    }

    if (data) {
      profile.value = data
    }
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }

    currentUser.value = data.user
    await fetchProfile(data.user.id)
    return { success: true }
  }

  async function register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) return { success: false, error: error.message }

    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        email: email,
        logo_url: '',
      })

      currentUser.value = data.user
      await fetchProfile(data.user.id)
    }

    return { success: true }
  }

  async function updateLogo(dataUrl) {
    if (!currentUser.value) return

    await supabase
      .from('profiles')
      .update({ logo_url: dataUrl })
      .eq('id', currentUser.value.id)

    profile.value = { ...profile.value, logo_url: dataUrl }
  }

  async function logout() {
    await supabase.auth.signOut()
    currentUser.value = null
    profile.value = null
  }

  async function getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error.message)
      return []
    }
    return data || []
  }

  return {
    currentUser,
    profile,
    loading,
    isLoggedIn,
    userLogo,
    init,
    login,
    register,
    updateLogo,
    logout,
    getAllUsers,
  }
})
