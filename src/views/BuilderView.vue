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
      <button class="topbar-icon-btn" @click="handleSave" title="Guardar">
        <HIcon name="save" :size="20" :stroke-width="1.5" />
      </button>
      <button class="topbar-icon-btn" @click="handleShare" title="Compartir">
        <HIcon name="share" :size="20" :stroke-width="1.5" />
      </button>
      <button
        v-if="store.active.status === 'aprobada'"
        class="topbar-icon-btn whatsapp-icon"
        @click="sendWhatsApp"
        title="Solicitar pago"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>
    </template>

    <div class="builder-wrapper">
      <div class="builder-page">
        <QuoteHeader :data="store.active" />

        <ClientInfoForm
          :data="store.active"
          @update:clientName="(v) => (store.active.clientName = v)"
          @update:clientPhone="(v) => (store.active.clientPhone = v)"
          @update:clientEmail="(v) => (store.active.clientEmail = v)"
          @update:eventType="(v) => (store.active.eventType = v)"
          @update:eventDate="(v) => (store.active.eventDate = v)"
          @update:venue="(v) => (store.active.venue = v)"
        />

        <!-- Items -->
        <div class="items-section">
          <!-- Desktop table -->
          <table class="items-table items-table-desktop">
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

          <!-- Mobile cards -->
          <div class="items-mobile">
            <div
              v-for="(item, index) in allItems"
              :key="'m-' + item.id"
              class="item-card"
            >
              <div class="item-card-header">
                <input
                  type="text"
                  class="cell-input"
                  placeholder="Nombre del concepto"
                  :value="item.name"
                  @input="updateItem(item.id, 'name', $event.target.value)"
                />
                <button
                  v-if="allItems.length > 1"
                  class="item-remove-mobile"
                  @click="removeItem(item.id)"
                >
                  <HIcon name="close" :size="16" />
                </button>
              </div>
              <div class="item-card-body">
                <div class="item-card-qty">
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
                </div>
                <div class="item-card-price">
                  <span class="cell-currency">$</span>
                  <input
                    type="text"
                    class="cell-input cell-input--right"
                    :value="formatNumber(item.unitPrice)"
                    @blur="updateItem(item.id, 'unitPrice', $event.target.value)"
                  />
                </div>
                <div class="item-card-subtotal">
                  {{ formatCurrency(item.qty * item.unitPrice) }}
                </div>
              </div>
            </div>
          </div>

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

        <!-- Payment Milestones -->
        <PaymentMilestones
          v-if="store.active.status === 'aprobada' || store.active.status === 'enviada'"
          :quotation="store.active"
          :total="store.grandTotal"
          @update:stages="store.updatePaymentStages"
        />
      </div>
    </div>

    <ShareModal
      :open="shareOpen"
      :quotation="store.active"
      @close="shareOpen = false"
      @export-pdf="exportPdf"
    />

    <!-- Keyboard shortcuts help -->
    <div class="shortcuts-help" @click="showShortcuts = !showShortcuts">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
        <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10"/>
      </svg>
      <span v-if="showShortcuts" class="shortcuts-list">
        <kbd>Ctrl+S</kbd> Guardar
        <kbd>Ctrl+P</kbd> Imprimir
        <kbd>Ctrl+N</kbd> Compartir
      </span>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuotationStore } from "../stores/quotation";
import { useToastStore } from "../stores/toast";
import { useAuthStore } from "../stores/auth";
import { useUnsavedGuard } from "../composables/useUnsavedGuard";
import { useKeyboardShortcuts } from "../composables/useKeyboardShortcuts";
import { formatCurrency } from "../utils/format";
import AppLayout from "../components/AppLayout.vue";
import QuoteHeader from "../components/QuoteHeader.vue";
import ClientInfoForm from "../components/ClientInfoForm.vue";
import ShareModal from "../components/ShareModal.vue";
import PaymentMilestones from "../components/PaymentMilestones.vue";
import HIcon from "../components/HIcon.vue";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const store = useQuotationStore();
const toast = useToastStore();
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const shareOpen = ref(false);
const statusOpen = ref(false);
const statusDropdownRef = ref(null);
const isDirty = ref(false);
const savedSnapshot = ref('');
const showShortcuts = ref(false);

const { confirmLeave } = useUnsavedGuard(isDirty);

// Keyboard shortcuts
useKeyboardShortcuts([
  { key: 's', ctrl: true, handler: handleSave },
  { key: 'p', ctrl: true, handler: printPage },
  { key: 'n', ctrl: true, handler: handleShare },
]);

// Track changes + auto-save
let autoSaveTimer = null;

watch(() => JSON.stringify(store.active), (newVal) => {
  if (savedSnapshot.value && newVal !== savedSnapshot.value) {
    isDirty.value = true;

    // Auto-save after 3 seconds of inactivity
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(async () => {
      if (store.active._dbId) {
        await store.save();
        isDirty.value = false;
        savedSnapshot.value = JSON.stringify(store.active);
      }
    }, 3000);
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

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  clearTimeout(autoSaveTimer);
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
  } else if (!store.active._dbId && store.active.sections?.length > 0) {
    // Already has data (from duplicate) — don't reset
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

async function handleShare() {
  // Open modal immediately for better UX
  shareOpen.value = true;

  // Save and change status in background
  if (!store.active.status || store.active.status === 'borrador') {
    store.active.status = 'enviada';
  }
  await store.save();
  isDirty.value = false;
  savedSnapshot.value = JSON.stringify(store.active);
}

async function sendWhatsApp() {
  const pi = auth.paymentInfo
  if (!pi || (!pi.bank && !pi.clabe && !pi.paypal)) {
    toast.error('Configura tus datos de pago en tu perfil')
    return
  }

  const q = store.active
  const total = store.grandTotal
  const userName = auth.profile?.full_name || ''

  let message = `✨ *Cotización aprobada*\n\n`
  message += `Hola ${q.clientName || ''},\n\n`
  message += `Tu cotización ha sido aprobada. A continuación los datos para realizar el depósito:\n\n`
  message += `📅 *Evento:* ${q.eventType || '—'}\n`
  message += `📍 *Venue:* ${q.venue || '—'}\n`
  message += `📆 *Fecha:* ${q.eventDate || '—'}\n`
  message += `💰 *Total:* $${total.toLocaleString('es-MX')} MXN\n\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`
  message += `🏦 *Datos de pago:*\n\n`

  if (pi.bank) message += `*Banco:* ${pi.bank}\n`
  if (pi.clabe) message += `*CLABE:* ${pi.clabe}\n`
  if (pi.account) message += `*Cuenta:* ${pi.account}\n`
  if (pi.holder) message += `*Titular:* ${pi.holder}\n`
  if (pi.paypal) message += `*PayPal:* ${pi.paypal}\n`

  message += `\nUna vez realizado el pago, por favor envíame el comprobante 🙏\n\n`
  message += `Saludos,\n${userName}`

  const encoded = encodeURIComponent(message)
  const clientPhone = q.clientPhone?.replace(/\D/g, '')

  if (clientPhone) {
    window.open(`https://api.whatsapp.com/send?phone=52${clientPhone}&text=${encoded}`, '_blank')
  } else {
    await navigator.clipboard.writeText(message)
    toast.info('No se encontró teléfono. Mensaje copiado al portapapeles.')
  }
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
  padding: 0 24px;
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
  padding-right: 16px;
}
.th-qty {
  width: 16%;
  text-align: center;
}
.th-price {
  width: 20%;
  text-align: right;
  padding-right: 8px;
}
.th-subtotal {
  width: 16%;
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
  width: 100%;
}

.cell-center {
  text-align: center;
  display: flex;
  justify-content: center;
}
.cell-right {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

/* Mobile items */
.items-mobile {
  display: none;
}

.item-card {
  background: #f7f7f7;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
}

.item-card-header {
  position: relative;
  margin-bottom: 10px;
}

.item-card-header .cell-input {
  width: 100%;
  padding-right: 32px;
}

.item-remove-mobile {
  position: absolute;
  top: 50%;
  right: 4px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.item-remove-mobile:hover {
  color: #e74c3c;
  background: #fef2f2;
}

.item-card-body {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 10px;
  align-items: center;
}

.topbar-icon-btn {
  background-color: transparent;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.topbar-icon-btn:hover {
  background: rgba(255,255,255,0.1);
}

.whatsapp-icon {
  color: #25D366;
}

.whatsapp-icon:hover {
  color: #1da851;
}

/* Keyboard shortcuts help */
.shortcuts-help {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--white);
  border: 1px solid var(--gray-border);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.2s;
  z-index: 50;
}

.shortcuts-help:hover {
  border-color: var(--gold);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.shortcuts-help svg {
  color: var(--gray-text);
  flex-shrink: 0;
}

.shortcuts-list {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--gray-text);
  white-space: nowrap;
}

.shortcuts-list kbd {
  background: var(--gray-light);
  border: 1px solid var(--gray-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: 'Google Sans Code', monospace;
}

@media (max-width: 480px) {
  .cell-input--right {
    width: 60px !important;
  }
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
