<template>
  <div>
    <div class="toolbar">
      <h1>CotizaYa by Vēlum</h1>
      <div class="toolbar-actions">
        <span class="toolbar-user">{{ auth.currentUser?.fullName }}</span>
        <router-link
          v-if="auth.currentUser?.role === 'admin'"
          to="/usuarios"
          class="toolbar-btn"
        >
          Usuarios
        </router-link>
        <router-link to="/perfil" class="toolbar-btn">Mi Perfil</router-link>
        <router-link to="/nueva" class="toolbar-btn primary"
          >+ Nueva</router-link
        >
        <button class="toolbar-btn danger" @click="handleLogout">Salir</button>
      </div>
    </div>

    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Mis Cotizaciones</h1>
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
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuotationStore } from "../stores/quotation";
import { useAuthStore } from "../stores/auth";
import QuotationCard from "../components/QuotationCard.vue";
import EmptyState from "../components/EmptyState.vue";

const store = useQuotationStore();
const auth = useAuthStore();
const router = useRouter();

onMounted(() => {
  store.loadAll();
});

function editQuotation(id) {
  router.push(`/editar/${id}`);
}

async function deleteQuotation(id) {
  if (confirm("¿Eliminar esta cotización?")) {
    await store.deleteById(id);
  }
}

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.toolbar-user {
  color: var(--gold);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0 8px;
}
</style>
