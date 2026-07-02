<template>
  <AppLayout>
    <template #actions>
      <div class="status-dropdown" ref="statusDropdownRef">
        <button class="status-trigger" @click="statusOpen = !statusOpen">
          <span
            class="status-dot"
            :class="store.active.status || 'borrador'"
          ></span>
          <span class="status-text">{{
            statusLabels[store.active.status] || "Borrador"
          }}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3,4.5 6,7.5 9,4.5" />
          </svg>
        </button>
        <div v-if="statusOpen" class="status-menu">
          <button
            v-for="(label, key) in statusLabels"
            :key="key"
            class="status-option"
            :class="{ active: store.active.status === key }"
            @click="selectStatus(key)"
          >
            <span class="status-dot" :class="key"></span>
            <span>{{ label }}</span>
            <svg
              v-if="store.active.status === key"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>
      <button
        class="topbar-icon-btn"
        @click="shareOpen = true"
        title="Compartir"
      >
        <HIcon name="share" :size="22" :stroke-width="1.5" />
      </button>
      <button class="topbar-icon-btn" @click="handleSave" title="Guardar">
        <HIcon name="save" :size="22" :stroke-width="1.5" />
      </button>
      <button class="topbar-icon-btn" @click="printPage" title="Imprimir">
        <HIcon name="printer" :size="22" :stroke-width="1.5" />
      </button>
    </template>

    <div class="builder-wrapper">
      <div class="builder-page">
        <QuoteHeader :data="store.active" />

        <ClientInfoForm
          :data="store.active"
          @update:clientName="(v) => (store.active.clientName = v)"
          @update:clientPhone="(v) => (store.active.clientPhone = v)"
          @update:eventType="(v) => (store.active.eventType = v)"
          @update:eventDate="(v) => (store.active.eventDate = v)"
          @update:venue="(v) => (store.active.venue = v)"
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
              <tr
                v-for="(item, index) in allItems"
                :key="item.id"
                class="item-row"
                :class="{ 'drag-over': dragOverIndex === index, 'dragging': draggedIndex === index }"
                draggable="true"
                @dragstart="onDragStart(index)"
                @dragover.prevent="onDragOver(index)"
                @dragend="onDragEnd"
                @dragleave="onDragLeave"
              >
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
                    <button class="qty-btn" @click="changeQty(item.id, -1)">
                      −
                    </button>
                    <input
                      type="number"
                      class="qty-input"
                      :value="item.qty"
                      min="1"
                      @input="updateItem(item.id, 'qty', $event.target.value)"
                    />
                    <button class="qty-btn" @click="changeQty(item.id, 1)">
                      +
                    </button>
                  </div>
                  <span class="qty-print">{{ item.qty }}</span>
                </td>
                <td class="cell-right">
                  <span class="cell-currency">$</span>
                  <input
                    type="text"
                    class="cell-input cell-input--right"
                    :value="formatNumber(item.unitPrice)"
                    @blur="
                      updateItem(item.id, 'unitPrice', $event.target.value)
                    "
                  />
                </td>
                <td class="cell-right cell-subtotal">
                  {{ formatCurrency(item.qty * item.unitPrice) }}
                </td>
                <td class="cell-center">
                  <button
                    v-if="allItems.length > 1"
                    class="item-remove"
                    @click="removeItem(item.id)"
                  >
                    <HIcon name="close" :size="16" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button class="btn-add-concept" @click="addItem">
            Agregar concepto
          </button>
        </div>

        <!-- Total -->
        <div class="total-bar">
          <span class="total-label">Total</span>
          <span class="total-value"
            >{{ formatCurrency(store.grandTotal) }} MXN</span
          >
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

        <!-- Reminder -->
        <div class="reminder-section">
          <div class="reminder-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span>Recordatorio de seguimiento</span>
          </div>
          <div class="reminder-fields">
            <div class="reminder-field">
              <label class="notes-label">Fecha</label>
              <input
                type="date"
                class="reminder-input"
                :value="store.active.reminderDate"
                @input="store.active.reminderDate = $event.target.value"
              />
            </div>
            <div class="reminder-field">
              <label class="notes-label">Nota</label>
              <input
                type="text"
                class="reminder-input"
                placeholder="Ej: Seguimiento post-evento"
                :value="store.active.reminderNote"
                @input="store.active.reminderNote = $event.target.value"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ShareModal
      :open="shareOpen"
      :quotation="store.active"
      @close="shareOpen = false"
      @export-pdf="exportPdf"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuotationStore } from "../stores/quotation";
import { useToastStore } from "../stores/toast";
import { useUnsavedGuard } from "../composables/useUnsavedGuard";
import { formatCurrency } from "../utils/format";
import AppLayout from "../components/AppLayout.vue";
import QuoteHeader from "../components/QuoteHeader.vue";
import ClientInfoForm from "../components/ClientInfoForm.vue";
import ShareModal from "../components/ShareModal.vue";
import HIcon from "../components/HIcon.vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const store = useQuotationStore();
const toast = useToastStore();
const route = useRoute();
const router = useRouter();

const shareOpen = ref(false);
const statusOpen = ref(false);
const statusDropdownRef = ref(null);
const isDirty = ref(false);
const savedSnapshot = ref('');

const { confirmLeave } = useUnsavedGuard(isDirty);

// Track changes
watch(() => JSON.stringify(store.active), (newVal) => {
  if (savedSnapshot.value && newVal !== savedSnapshot.value) {
    isDirty.value = true;
  }
});

// Drag & drop state
const draggedIndex = ref(null);
const dragOverIndex = ref(null);

const statusLabels = {
  borrador: "Borrador",
  enviada: "Enviada",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

function selectStatus(key) {
  store.active.status = key;
  store.updateStatus(store.active.id, key);
  statusOpen.value = false;
  toast.success(`Estado: ${statusLabels[key]}`);
}

// Close dropdown on outside click
function handleClickOutside(e) {
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(e.target)) {
    statusOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  setTimeout(() => {
    savedSnapshot.value = JSON.stringify(store.active);
  }, 500);
});

const allItems = computed(() => {
  const items = [];
  for (const section of store.active.sections) {
    for (const item of section.items) {
      items.push(item);
    }
  }
  return items;
});

onMounted(async () => {
  if (route.params.id) {
    await store.loadAll();
    const found = await store.loadById(route.params.id);
    if (!found) router.push("/");
  } else {
    store.createNew();
  }
});

function addItem() {
  const sections = store.active.sections;
  if (sections.length > 0) {
    store.addItem(sections[sections.length - 1].id);
  }
}

function removeItem(itemId) {
  const sections = store.active.sections;
  if (sections.length > 0) {
    store.removeItem(sections[0].id, itemId);
  }
}

// Drag & drop
function onDragStart(index) {
  draggedIndex.value = index;
}

function onDragOver(index) {
  if (draggedIndex.value === null) return;
  dragOverIndex.value = index;
}

function onDragEnd() {
  if (draggedIndex.value !== null && dragOverIndex.value !== null && draggedIndex.value !== dragOverIndex.value) {
    const section = store.active.sections[0];
    if (!section) return;
    const list = [...section.items];
    const [moved] = list.splice(draggedIndex.value, 1);
    list.splice(dragOverIndex.value, 0, moved);
    section.items = list;
  }
  draggedIndex.value = null;
  dragOverIndex.value = null;
}

function onDragLeave() {
  dragOverIndex.value = null;
}

function changeQty(itemId, delta) {
  const item = allItems.value.find((i) => i.id === itemId);
  if (!item) return;
  const newQty = Math.max(1, item.qty + delta);
  updateItem(itemId, "qty", String(newQty));
}

function updateItem(itemId, field, value) {
  for (const section of store.active.sections) {
    const item = section.items.find((i) => i.id === itemId);
    if (!item) continue;
    if (field === "name") {
      item.name = value.trim();
    } else if (field === "qty") {
      item.qty = Math.max(1, parseInt(value.replace(/[^0-9]/g, "")) || 1);
    } else if (field === "unitPrice") {
      item.unitPrice = Math.max(
        0,
        parseFloat(value.replace(/[^0-9.\-]/g, "")) || 0,
      );
    }
  }
}

function formatNumber(num) {
  return Number(num || 0).toLocaleString("en-US");
}

async function handleSave() {
  await store.save();
  isDirty.value = false;
  savedSnapshot.value = JSON.stringify(store.active);
  toast.success("Cotización guardada");
}

async function exportPdf() {
  const element = document.querySelector(".builder-page");
  if (!element) return;

  toast.info("Generando PDF...");

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", "a4");

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const clientName = store.active.clientName || "cotizacion";
    const fileName = `cotizacion-${clientName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    pdf.save(fileName);

    toast.success("PDF descargado");
  } catch (err) {
    console.error("Error generating PDF:", err);
    toast.error("Error al generar PDF");
  }
}

function printPage() {
  window.print();
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
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

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
}

.th-concept {
  width: 40%;
}
.th-qty {
  width: 16%;
  text-align: center;
}
.th-price {
  width: 18%;
  text-align: right;
}
.th-subtotal {
  width: 18%;
  text-align: right;
}
.th-actions {
  width: 8%;
}

.item-row {
  transition: all 0.2s;
}

.item-row.dragging {
  opacity: 0.4;
}

.item-row.drag-over {
  border-top: 2px solid var(--gold);
}

.item-row td {
  padding: 10px 0;
  vertical-align: middle;
}

.cell-input {
  width: 100%;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-family: "Google Sans", sans-serif;
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

.cell-center {
  text-align: center;
}
.cell-right {
  text-align: right;
}

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
  font-family: "Google Sans", sans-serif;
  color: var(--black);
  background: transparent;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

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
  font-family: "Google Sans", sans-serif;
  margin: 16px 0 24px;
}

.btn-add-concept:hover {
  background: #4a4a4a;
}

.total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
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
  font-family: "Google Sans", sans-serif;
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

/* Reminder */
.reminder-section {
  padding: 20px 40px 28px;
  border-top: 1px solid var(--gray-border);
}

.reminder-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-text);
  font-size: 0.82rem;
  margin-bottom: 14px;
}

.reminder-fields {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 14px;
}

.reminder-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reminder-input {
  padding: 10px 12px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Google Sans', sans-serif;
  color: var(--black);
  outline: none;
  transition: border-color 0.2s;
}

.reminder-input:focus {
  border-color: var(--gold);
}

/* Status dropdown */
.status-dropdown {
  position: relative;
}

.status-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-family: "Google Sans", sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.status-trigger:hover {
  background: rgba(255, 255, 255, 0.15);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.borrador {
  background: #9ca3af;
}
.status-dot.enviada {
  background: #3b82f6;
}
.status-dot.aprobada {
  background: #22c55e;
}
.status-dot.rechazada {
  background: #ef4444;
}

.status-text {
  white-space: nowrap;
}

.status-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--white);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 180px;
  z-index: 150;
}

.status-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-family: "Google Sans", sans-serif;
  color: var(--black);
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}

.status-option:hover {
  background: var(--gray-light);
}

.status-option.active {
  font-weight: 600;
  background: rgba(201, 168, 106, 0.08);
}

.status-option svg {
  margin-left: auto;
  color: var(--gold);
}

/* Print-only qty */
.qty-print {
  display: none;
}

.topbar-icon-btn {
  background-color: transparent;
  color: white;
  border: none;
}

@media print {
  .topbar,
  .btn-add-concept,
  .item-remove,
  .qty-stepper,
  .th-actions,
  .no-print {
    display: none !important;
  }
  .qty-print {
    display: inline !important;
    font-size: 0.82rem;
  }
  .builder-wrapper {
    padding: 0;
  }
  .builder-page {
    box-shadow: none;
    border-radius: 0;
  }
  .cell-input {
    border: none !important;
    padding: 2px 0;
  }
}
</style>
