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
          <div class="header-icon">
            <HIcon name="document" :size="36" />
          </div>
          <h1>Mis cotizaciones</h1>
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
import AppLayout from '../components/AppLayout.vue'
import QuotationCard from '../components/QuotationCard.vue'
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
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  color: #999;
  margin-bottom: 10px;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--black);
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
