<template>
  <AppLayout>
    <div class="dashboard">
      <template v-if="store.savedList.length === 0">
        <div class="empty-hero">
          <div class="empty-icon">
            <HIcon name="document" :size="48" />
          </div>
          <h1>No hay cotizaciones</h1>
          <p>Crea tu primera cotización para comenzar</p>
          <router-link to="/nueva" class="empty-btn">Crear mi primer cotización</router-link>
        </div>
      </template>

      <template v-else>
        <div class="dashboard-header">
          <div class="header-left">
            <div class="header-icon">
              <HIcon name="document" :size="36" />
            </div>
            <h1>Mis cotizaciones</h1>
          </div>
          <router-link to="/nueva" class="new-quote-btn">
            <HIcon name="plus" :size="18" />
            Nueva cotización
          </router-link>
        </div>
        <div class="dashboard-grid">
          <QuotationCard
            v-for="q in store.savedList"
            :key="q.id"
            :quotation="q"
            @edit="editQuotation"
            @delete="deleteQuotation"
          />
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { useToastStore } from '../stores/toast'
import AppLayout from '../components/AppLayout.vue'
import QuotationCard from '../components/QuotationCard.vue'
import HIcon from '../components/HIcon.vue'

const store = useQuotationStore()
const toast = useToastStore()
const router = useRouter()

onMounted(() => {
  store.loadAll()
})

function editQuotation(id) {
  router.push(`/editar/${id}`)
}

async function deleteQuotation(id) {
  if (confirm('¿Eliminar esta cotización?')) {
    await store.deleteById(id)
    toast.success('Cotización eliminada')
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Empty state */
.empty-hero {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: #999;
  margin-bottom: 16px;
}

.empty-hero h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 6px;
}

.empty-hero p {
  font-size: 0.9rem;
  color: var(--gray-text);
  margin-bottom: 28px;
}

.empty-btn {
  display: inline-block;
  background: var(--black);
  color: var(--white);
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
}

.empty-btn:hover {
  opacity: 0.9;
}

/* With data */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #999;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
}

.new-quote-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--black);
  color: var(--white);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.new-quote-btn:hover {
  background: #4a4a4a;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 700px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
