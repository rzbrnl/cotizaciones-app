<template>
  <AppLayout>
    <template #actions>
      <button class="topbar-icon-btn" @click="shareOpen = true" title="Compartir">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </button>
      <button class="topbar-icon-btn" @click="handleSave" title="Guardar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <polyline points="17 21 17 13 7 13 7 21"/>
          <polyline points="7 3 7 8 15 8"/>
        </svg>
      </button>
      <button class="topbar-icon-btn" @click="printPage" title="Imprimir">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="6 9 6 2 18 2 18 9"/>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
          <rect x="6" y="14" width="12" height="8"/>
        </svg>
      </button>
    </template>

    <div class="builder-wrapper">
      <div class="builder-page">
        <QuoteHeader :data="store.active" />

        <ClientInfoForm
          :data="store.active"
          @update:clientName="v => store.active.clientName = v"
          @update:clientPhone="v => store.active.clientPhone = v"
          @update:eventType="v => store.active.eventType = v"
          @update:eventDate="v => store.active.eventDate = v"
          @update:venue="v => store.active.venue = v"
        />

        <!-- Items -->
        <div class="items-section">
          <table class="items-table">
            <thead>
              <tr>
                <th class="th-concept">Concepto</th>
                <th class="th-qty">Cantidad</th>
                <th class="th-price">Precio</th>
                <th class="th-subtotal">Subtotal</th>
                <th class="th-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in allItems" :key="item.id" class="item-row">
                <td>
                  <input
                    type="text"
                    class="cell-input"
                    placeholder="Nombre del concepto"
                    :value="item.name"
                    @input="updateItem(item.id, 'name', $event.target.value)"
                  />
                </td>
                <td class="cell-center">
                  <div class="qty-stepper">
                    <button class="qty-btn" @click="changeQty(item.id, -1)">−</button>
                    <input
                      type="number"
                      class="qty-input"
                      :value="item.qty"
                      min="1"
                      @input="updateItem(item.id, 'qty', $event.target.value)"
                    />
                    <button class="qty-btn" @click="changeQty(item.id, 1)">+</button>
                  </div>
                </td>
                <td class="cell-right">
                  <span class="cell-currency">$</span>
                  <input
                    type="text"
                    class="cell-input cell-input--right"
                    :value="formatNumber(item.unitPrice)"
                    @blur="updateItem(item.id, 'unitPrice', $event.target.value)"
                  />
                </td>
                <td class="cell-right cell-subtotal">
                  {{ formatCurrency(item.qty * item.unitPrice) }}
                </td>
                <td class="cell-center">
                  <button v-if="allItems.length > 1" class="item-remove" @click="removeItem(item.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button class="btn-add-concept" @click="addItem">Agregar concepto</button>
        </div>

        <!-- Total -->
        <div class="total-bar">
          <span class="total-label">Total</span>
          <span class="total-value">{{ formatCurrency(store.grandTotal) }} MXN</span>
        </div>

        <!-- Notes -->
        <div class="notes-section">
          <label class="notes-label">Notas / Observaciones</label>
          <textarea
            class="notes-textarea"
            placeholder="Escribe tus notas aquí..."
            :value="store.active.notes"
            @input="store.active.notes = $event.target.value"
            rows="4"
          ></textarea>
        </div>
      </div>
    </div>

    <ShareModal
      :open="shareOpen"
      :quotation="store.active"
      @close="shareOpen = false"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotationStore } from '../stores/quotation'
import { formatCurrency } from '../utils/format'
import AppLayout from '../components/AppLayout.vue'
import QuoteHeader from '../components/QuoteHeader.vue'
import ClientInfoForm from '../components/ClientInfoForm.vue'
import ShareModal from '../components/ShareModal.vue'

const store = useQuotationStore()
const route = useRoute()
const router = useRouter()

const shareOpen = ref(false)

const allItems = computed(() => {
  const items = []
  for (const section of store.active.sections) {
    for (const item of section.items) {
      items.push(item)
    }
  }
  return items
})

onMounted(async () => {
  if (route.params.id) {
    await store.loadAll()
    const found = await store.loadById(route.params.id)
    if (!found) router.push('/')
  } else {
    store.createNew()
  }
})

function addItem() {
  const sections = store.active.sections
  if (sections.length > 0) {
    store.addItem(sections[sections.length - 1].id)
  }
}

function removeItem(itemId) {
  const sections = store.active.sections
  if (sections.length > 0) {
    store.removeItem(sections[0].id, itemId)
  }
}

function changeQty(itemId, delta) {
  const item = allItems.value.find(i => i.id === itemId)
  if (!item) return
  const newQty = Math.max(1, item.qty + delta)
  updateItem(itemId, 'qty', String(newQty))
}

function updateItem(itemId, field, value) {
  for (const section of store.active.sections) {
    const item = section.items.find(i => i.id === itemId)
    if (!item) continue
    if (field === 'name') {
      item.name = value.trim()
    } else if (field === 'qty') {
      item.qty = Math.max(1, parseInt(value.replace(/[^0-9]/g, '')) || 1)
    } else if (field === 'unitPrice') {
      item.unitPrice = Math.max(0, parseFloat(value.replace(/[^0-9.\-]/g, '')) || 0)
    }
  }
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString('en-US')
}

async function handleSave() {
  await store.save()
  alert('Cotización guardada')
}

function printPage() {
  window.print()
}
</script>

<style scoped>
.builder-wrapper {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.builder-page {
  background: var(--white);
  width: 100%;
  max-width: 760px;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* Items table */
.items-section {
  padding: 0 40px;
  margin-top: 8px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
}

.items-table thead th {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--gray-text);
  font-weight: 500;
  padding: 0 0 12px;
  text-align: left;
  border-bottom: 1px solid var(--gray-border);
}

.th-concept { width: 40%; }
.th-qty { width: 16%; text-align: center; }
.th-price { width: 18%; text-align: right; }
.th-subtotal { width: 18%; text-align: right; }
.th-actions { width: 8%; }

.item-row td {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
}

.cell-input {
  width: 100%;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;
}

.cell-input:focus {
  border-color: var(--gold);
}

.cell-input::placeholder {
  color: #ccc;
}

.cell-input--right {
  text-align: right;
  width: 90px;
}

.cell-center { text-align: center; }
.cell-right { text-align: right; }

.cell-currency {
  color: var(--gray-text);
  font-size: 0.82rem;
  margin-right: 4px;
}

.cell-subtotal {
  font-weight: 500;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  padding-right: 8px;
}

/* Qty stepper */
.qty-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  overflow: hidden;
}

.qty-btn {
  width: 28px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--gray-text);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.qty-btn:hover {
  background: var(--gray-light);
  color: var(--black);
}

.qty-input {
  width: 36px;
  text-align: center;
  border: none;
  border-left: 1px solid var(--gray-border);
  border-right: 1px solid var(--gray-border);
  outline: none;
  padding: 4px 0;
  font-size: 0.82rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  background: transparent;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* Remove button */
.item-remove {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: all 0.15s;
}

.item-row:hover .item-remove {
  opacity: 1;
}

.item-remove:hover {
  color: #e74c3c;
  background: #fef2f2;
}

/* Add concept button */
.btn-add-concept {
  display: inline-block;
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
  margin: 16px 0 24px;
}

.btn-add-concept:hover {
  background: #4a4a4a;
}

/* Total */
.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  border-top: 2px solid var(--black);
  border-bottom: 2px solid var(--black);
}

.total-label {
  font-size: 1.4rem;
  font-weight: 400;
}

.total-value {
  font-size: 1.4rem;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

/* Notes */
.notes-section {
  padding: 24px 40px 36px;
}

.notes-label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gray-text);
  font-weight: 500;
  margin-bottom: 10px;
}

.notes-textarea {
  width: 100%;
  min-height: 100px;
  padding: 14px 16px;
  border: 1px solid var(--gray-border);
  border-radius: 10px;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}

.notes-textarea:focus {
  border-color: var(--gold);
}

.notes-textarea::placeholder {
  color: #ccc;
}

@media print {
  .topbar, .btn-add-concept, .item-remove, .qty-stepper,
  .th-actions, .no-print { display: none !important; }
  .builder-wrapper { padding: 0; }
  .builder-page { box-shadow: none; border-radius: 0; }
  .cell-input { border: none !important; padding: 2px 0; }
}
</style>
