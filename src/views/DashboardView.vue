<template>
  <AppLayout>
    <div class="dashboard">
      <div class="dashboard-hero">
        <div class="dashboard-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
          </svg>
        </div>
        <h1>{{ store.savedList.length === 0 ? 'No hay cotizaciones' : 'Mis cotizaciones' }}</h1>
        <p v-if="store.savedList.length === 0">Crea tu primera cotización para comenzar</p>
      </div>

      <EmptyState v-if="store.savedList.length === 0" />

      <div v-else class="dashboard-grid">
        <QuotationCard
          v-for="q in store.savedList"
          :key="q.id"
          :quotation="q"
          @edit="editQuotation"
          @delete="deleteQuotation"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import AppLayout from '../components/AppLayout.vue'
import QuotationCard from '../components/QuotationCard.vue'
import EmptyState from '../components/EmptyState.vue'

const store = useQuotationStore()
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
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.dashboard-hero {
  text-align: center;
  margin-bottom: 36px;
}

.dashboard-icon {
  color: #999;
  margin-bottom: 12px;
}

.dashboard-hero h1 {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 4px;
}

.dashboard-hero p {
  font-size: 0.9rem;
  color: var(--gray-text);
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
