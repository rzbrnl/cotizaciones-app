<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="catalog-overlay" @click="emit('close')" />
    </transition>
    <transition name="slide">
      <div v-if="open" class="catalog-panel">
        <div class="catalog-header">
          <h3>Catálogo</h3>
          <button class="catalog-close" @click="emit('close')">&times;</button>
        </div>

        <!-- Buscador -->
        <div class="catalog-search">
          <svg class="catalog-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Buscar producto..."
            class="catalog-search-input"
          />
        </div>

        <!-- Tabs de categorías -->
        <div class="catalog-tabs">
          <button
            class="catalog-tab"
            :class="{ active: activeCategory === 'Todos' }"
            @click="activeCategory = 'Todos'"
          >Todos</button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="catalog-tab"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>

        <!-- Lista de productos -->
        <div class="catalog-list">
          <div
            v-for="product in filteredProducts"
            :key="product.name + product.category"
            class="catalog-item"
          >
            <template v-if="editingProduct?.name === product.name && editingProduct?.category === product.category">
              <!-- Modo edición -->
              <div class="edit-form">
                <input v-model="editForm.name" class="edit-input" placeholder="Nombre" />
                <div class="edit-row">
                  <input v-model.number="editForm.price" type="number" class="edit-input edit-input--small" placeholder="Precio" />
                  <select v-model="editForm.category" class="edit-input edit-input--select">
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div class="edit-actions">
                  <button class="edit-btn save" @click="saveEdit">Guardar</button>
                  <button class="edit-btn cancel" @click="editingProduct = null">Cancelar</button>
                </div>
              </div>
            </template>
            <template v-else>
              <!-- Modo visualización -->
              <div class="catalog-item-info" @click="addProduct(product)">
                <div class="catalog-item-name">{{ product.name }}</div>
                <div class="catalog-item-cat">{{ product.category }}</div>
              </div>
              <div class="catalog-item-right">
                <span class="catalog-item-price">{{ formatCurrency(product.defaultPrice) }}</span>
                <button class="catalog-item-edit" @click="startEdit(product)" title="Editar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <span class="catalog-item-add" @click="addProduct(product)">+</span>
              </div>
            </template>
          </div>
          <div v-if="filteredProducts.length === 0" class="catalog-empty">
            No se encontraron productos
          </div>
        </div>

        <!-- Agregar producto personalizado -->
        <div class="catalog-custom">
          <div class="catalog-custom-header">Nuevo producto</div>
          <div class="catalog-custom-form">
            <input
              v-model="newProduct.name"
              placeholder="Nombre del producto"
              class="catalog-custom-input"
              @keyup.enter="addCustom"
            />
            <div class="catalog-custom-row">
              <input
                v-model.number="newProduct.price"
                type="number"
                placeholder="Precio"
                class="catalog-custom-price"
                @keyup.enter="addCustom"
              />
              <select v-model="newProduct.category" class="catalog-custom-category">
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <button class="catalog-custom-btn" @click="addCustom">+</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { catalog } from '../data/catalog'
import { formatCurrency } from '../utils/format'

const props = defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'addProduct'])

const categories = Object.keys(catalog)
const activeCategory = ref('Todos')
const search = ref('')
const editingProduct = ref(null)
const editForm = reactive({ name: '', price: 0, category: '' })
const newProduct = reactive({ name: '', price: null, category: categories[0] })

const localCatalog = reactive(JSON.parse(JSON.stringify(catalog)))

const allProducts = computed(() => {
  const products = []
  for (const [cat, items] of Object.entries(localCatalog)) {
    for (const item of items) {
      products.push({ ...item, category: cat })
    }
  }
  return products
})

const filteredProducts = computed(() => {
  let products = activeCategory.value === 'Todos'
    ? allProducts.value
    : allProducts.value.filter(p => p.category === activeCategory.value)

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    products = products.filter(p => p.name.toLowerCase().includes(q))
  }

  return products
})

function addProduct(product) {
  emit('addProduct', { name: product.name, defaultPrice: product.defaultPrice })
}

function startEdit(product) {
  editingProduct.value = { name: product.name, category: product.category }
  editForm.name = product.name
  editForm.price = product.defaultPrice
  editForm.category = product.category
}

function saveEdit() {
  if (!editForm.name.trim()) return

  const old = editingProduct.value
  const oldCat = localCatalog[old.category]
  const idx = oldCat.findIndex(p => p.name === old.name)
  if (idx >= 0) oldCat.splice(idx, 1)

  if (!localCatalog[editForm.category]) {
    localCatalog[editForm.category] = []
  }
  localCatalog[editForm.category].push({
    name: editForm.name.trim(),
    defaultPrice: editForm.price || 0,
  })

  editingProduct.value = null
}

function addCustom() {
  if (!newProduct.name.trim() || !newProduct.price) return

  if (!localCatalog[newProduct.category]) {
    localCatalog[newProduct.category] = []
  }
  localCatalog[newProduct.category].push({
    name: newProduct.name.trim(),
    defaultPrice: newProduct.price,
  })

  emit('addProduct', { name: newProduct.name.trim(), defaultPrice: newProduct.price })
  newProduct.name = ''
  newProduct.price = null
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

.catalog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 200;
}

.catalog-panel {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 380px;
  max-width: 100vw;
  background: var(--white);
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  z-index: 201;
  display: flex;
  flex-direction: column;
}

/* Header */
.catalog-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.catalog-header h3 {
  font-size: 0.9rem;
  font-weight: 600;
}

.catalog-close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: var(--gray-text);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.catalog-close:hover {
  background: var(--gray-light);
}

/* Search */
.catalog-search {
  padding: 12px 16px;
  position: relative;
}

.catalog-search-icon {
  position: absolute;
  left: 28px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  pointer-events: none;
}

.catalog-search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.catalog-search-input:focus {
  border-color: var(--gold);
}

/* Tabs */
.catalog-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--gray-border);
  overflow-x: auto;
  flex-shrink: 0;
  padding: 0 8px;
}

.catalog-tabs::-webkit-scrollbar { display: none; }

.catalog-tab {
  padding: 10px 12px;
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  border: none;
  background: none;
  color: var(--gray-text);
  cursor: pointer;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.catalog-tab:hover { color: var(--black); }

.catalog-tab.active {
  color: var(--black);
  border-bottom-color: var(--black);
  font-weight: 600;
}

/* Product list */
.catalog-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.catalog-item {
  padding: 10px 16px;
  transition: background 0.15s;
}

.catalog-item:hover {
  background: var(--gold-light);
}

.catalog-item-info {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.catalog-item-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--black);
}

.catalog-item-cat {
  font-size: 0.7rem;
  color: var(--gray-text);
  margin-top: 2px;
}

.catalog-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.catalog-item-price {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--gray-text);
  font-variant-numeric: tabular-nums;
}

.catalog-item-edit {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: all 0.15s;
}

.catalog-item:hover .catalog-item-edit {
  opacity: 1;
}

.catalog-item-edit:hover {
  color: var(--gold);
  background: rgba(201, 169, 110, 0.15);
}

.catalog-item-add {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--black);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
}

.catalog-item:hover .catalog-item-add {
  opacity: 1;
}

.catalog-item-add:hover {
  background: var(--gold);
  color: var(--black);
}

.catalog-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--gray-text);
  font-size: 0.85rem;
}

/* Edit form */
.edit-form {
  padding: 4px 0;
}

.edit-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--gray-border);
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  margin-bottom: 8px;
  transition: border-color 0.2s;
}

.edit-input:focus {
  border-color: var(--gold);
}

.edit-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.edit-input--small {
  width: 100px;
  margin-bottom: 0;
}

.edit-input--select {
  flex: 1;
  margin-bottom: 0;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.edit-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}

.edit-btn.save {
  background: var(--black);
  color: var(--white);
}

.edit-btn.save:hover {
  background: #333;
}

.edit-btn.cancel {
  background: none;
  border: 1px solid var(--gray-border);
  color: var(--gray-text);
}

.edit-btn.cancel:hover {
  border-color: var(--gray-text);
}

/* Custom product */
.catalog-custom {
  padding: 14px 16px;
  border-top: 1px solid var(--gray-border);
  flex-shrink: 0;
}

.catalog-custom-header {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--gray-text);
  font-weight: 500;
  margin-bottom: 10px;
}

.catalog-custom-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.catalog-custom-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.catalog-custom-input:focus {
  border-color: var(--gold);
}

.catalog-custom-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.catalog-custom-price {
  width: 90px;
  padding: 9px 10px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color 0.2s;
}

.catalog-custom-price:focus {
  border-color: var(--gold);
}

.catalog-custom-category {
  flex: 1;
  padding: 9px 10px;
  border: 1px solid var(--gray-border);
  border-radius: 8px;
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 24px;
  transition: border-color 0.2s;
}

.catalog-custom-category:focus {
  border-color: var(--gold);
}

.catalog-custom-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--black);
  color: var(--white);
  font-size: 1.2rem;
  font-weight: 300;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.catalog-custom-btn:hover {
  background: var(--gold);
  color: var(--black);
}

@media (max-width: 600px) {
  .catalog-panel { width: 100%; }
}
</style>
