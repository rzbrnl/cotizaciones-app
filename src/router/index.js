import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'
import LandingView from '../views/LandingView.vue'
import DashboardView from '../views/DashboardView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import BuilderView from '../views/BuilderView.vue'
import ShareView from '../views/ShareView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UsersAdminView from '../views/UsersAdminView.vue'
import ProfileView from '../views/ProfileView.vue'

import PublicQuotationView from '../views/PublicQuotationView.vue'

const routes = [
  { path: '/', name: 'landing', component: LandingView },
  { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },
  { path: '/registro', name: 'register', component: RegisterView, meta: { guest: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { auth: true } },
  { path: '/calendario', name: 'calendario', component: CalendarioView, meta: { auth: true } },
  { path: '/nueva', name: 'new', component: BuilderView, meta: { auth: true } },
  { path: '/editar/:id', name: 'edit', component: BuilderView, meta: { auth: true } },
  { path: '/perfil', name: 'profile', component: ProfileView, meta: { auth: true } },
  { path: '/usuarios', name: 'users', component: UsersAdminView, meta: { auth: true, admin: true } },
  { path: '/compartir/:hash', name: 'share', component: ShareView },
  { path: '/publica/:id', name: 'public', component: PublicQuotationView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  // Redirect authenticated users from landing to dashboard
  if (to.name === 'landing' && isLoggedIn) {
    next('/dashboard')
    return
  }

  if (to.meta.auth && !isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.guest && isLoggedIn) {
    next('/dashboard')
    return
  }

  if (to.meta.admin && isLoggedIn) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (data?.role !== 'admin') {
      next('/dashboard')
      return
    }
  }

  next()
})

export default router
