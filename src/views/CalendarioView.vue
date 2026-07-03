<template>
  <AppLayout>
    <div class="calendario-page">
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1>Calendario</h1>
        </div>
        <router-link to="/nueva" class="new-quote-btn">
          <HIcon name="plus" :size="18" />
          Nueva cotización
        </router-link>
      </div>

      <CalendarView
        :quotations="store.savedList"
        @select="editQuotation"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import AppLayout from '../components/AppLayout.vue'
import CalendarView from '../components/CalendarView.vue'
import HIcon from '../components/HIcon.vue'

const store = useQuotationStore()
const router = useRouter()

onMounted(async () => {
  await store.loadAll()
})

function editQuotation(id) {
  router.push(`/editar/${id}`)
}
</script>

<style scoped>
.calendario-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #999;
}

.page-header h1 {
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

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
