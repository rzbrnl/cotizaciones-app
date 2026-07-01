<template>
  <div v-if="quotation">
    <div class="page-wrapper">
      <div class="page">
        <QuoteHeader :data="quotation" :readonly="true" />
        <ClientInfoForm :data="quotation" :readonly="true" />

        <SectionBlock
          v-for="section in quotation.sections"
          :key="section.id"
          :section="section"
          :readonly="true"
        />

        <GrandTotal :total="total" />

        <NotesArea :notes="quotation.notes" :readonly="true" />
      </div>
    </div>

    <div class="share-badge">
      <span>Cotización compartida</span>
    </div>
  </div>

  <div
    v-else
    class="empty-state"
    style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <div class="empty-state-icon">⚠️</div>
    <h2>Cotización no encontrada</h2>
    <p>El enlace no es válido o la cotización está dañada</p>
    <router-link
      to="/"
      class="toolbar-btn primary"
      style="display: inline-block; padding: 10px 24px"
    >
      Volver al inicio
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { decodeQuotation } from "../utils/share";
import QuoteHeader from "../components/QuoteHeader.vue";
import ClientInfoForm from "../components/ClientInfoForm.vue";
import SectionBlock from "../components/SectionBlock.vue";
import GrandTotal from "../components/GrandTotal.vue";
import NotesArea from "../components/NotesArea.vue";

const route = useRoute();
const quotation = ref(null);

const total = computed(() => {
  if (!quotation.value) return 0;
  let t = 0;
  for (const section of quotation.value.sections || []) {
    for (const item of section.items || []) {
      t += (item.qty || 0) * (item.unitPrice || 0);
    }
  }
  return t;
});

onMounted(() => {
  quotation.value = decodeQuotation(route.params.hash);
});
</script>
