<template>
  <div>
    <div class="toolbar">
      <h1>COTIZACIONES</h1>
      <div class="toolbar-actions">
        <button class="toolbar-btn" @click="catalogOpen = true">Catálogo</button>
        <button class="toolbar-btn" @click="shareOpen = true">Compartir</button>
        <button class="toolbar-btn primary" @click="handleSave">Guardar</button>
        <button class="toolbar-btn" @click="window.print()">Imprimir</button>
        <router-link to="/perfil" class="toolbar-btn">Mi Perfil</router-link>
        <router-link to="/" class="toolbar-btn">Dashboard</router-link>
        <button class="toolbar-btn danger" @click="handleLogout">Salir</button>
      </div>
    </div>

    <div class="page-wrapper">
      <div class="page">
        <QuoteHeader :data="store.active" />

        <ClientInfoForm
          :data="store.active"
          @update:clientName="v => store.active.clientName = v"
          @update:clientPhone="v => store.active.clientPhone = v"
          @update:eventType="v => store.active.eventType = v"
          @update:eventDate="v => store.active.eventDate = v"
          @update:venue="v => store.active.venue = v"
        />

        <SectionBlock
          v-for="section in store.active.sections"
          :key="section.id"
          :section="section"
          @updateName="v => section.name = v || 'Sección'"
          @addItem="store.addItem(section.id)"
          @updateItem="(itemId, field, value) => updateItem(section.id, itemId, field, value)"
          @removeItem="itemId => store.removeItem(section.id, itemId)"
          @remove="store.removeSection(section.id)"
        />

        <div class="section-add-wrapper no-print">
          <button class="btn-add-dark" @click="store.addSection()">Agregar sección</button>
        </div>

        <GrandTotal :total="store.grandTotal" />

        <NotesArea
          :notes="store.active.notes"
          @update="v => store.active.notes = v"
        />
      </div>
    </div>

    <CatalogPanel
      :open="catalogOpen"
      @close="catalogOpen = false"
      @addProduct="handleAddProduct"
    />

    <ShareModal
      :open="shareOpen"
      :quotation="store.active"
      @close="shareOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { useAuthStore } from '../stores/auth'
import QuoteHeader from '../components/QuoteHeader.vue'
import ClientInfoForm from '../components/ClientInfoForm.vue'
import SectionBlock from '../components/SectionBlock.vue'
import GrandTotal from '../components/GrandTotal.vue'
import NotesArea from '../components/NotesArea.vue'
import CatalogPanel from '../components/CatalogPanel.vue'
import ShareModal from '../components/ShareModal.vue'

const store = useQuotationStore()
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const catalogOpen = ref(false)
const shareOpen = ref(false)

onMounted(async () => {
  if (route.params.id) {
    await store.loadAll()
    const found = await store.loadById(route.params.id)
    if (!found) {
      router.push('/')
    }
  } else {
    store.createNew()
  }
})

function updateItem(sectionId, itemId, field, value) {
  const section = store.active.sections.find(s => s.id === sectionId)
  if (!section) return
  const item = section.items.find(i => i.id === itemId)
  if (!item) return

  if (field === 'name') {
    item.name = value.trim()
  } else if (field === 'qty') {
    item.qty = Math.max(1, parseInt(value.replace(/[^0-9]/g, '')) || 1)
  } else if (field === 'unitPrice') {
    item.unitPrice = Math.max(0, parseFloat(value.replace(/[^0-9.\-]/g, '')) || 0)
  }
}

function handleAddProduct(product) {
  store.addProductFromCatalog(product)
  catalogOpen.value = false
}

async function handleSave() {
  await store.save()
  alert('Cotización guardada')
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}

const window = globalThis.window
</script>

<style scoped>
.section-add-wrapper {
  padding: 14px 48px;
}

.btn-add-dark {
  background: var(--black);
  color: var(--white);
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Google Sans', sans-serif;
}

.btn-add-dark:hover {
  background: #333;
}
</style>
