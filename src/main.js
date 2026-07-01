import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import './styles/variables.css'
import './styles/base.css'
import './styles/components.css'
import './styles/print.css'
import './styles/responsive.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

import { useAuthStore } from './stores/auth'
const auth = useAuthStore(pinia)
auth.init().then(() => {
  app.mount('#app')
})
