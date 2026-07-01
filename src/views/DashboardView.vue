<template>
  <AppLayout>
    <div class="dashboard">
      <div class="dashboard-hero">
        <div class="dashboard-icon">
          <HIcon name="document" :size="48" />
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
import HIcon from '../components/HIcon.vue'

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
