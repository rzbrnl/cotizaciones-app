<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <ToastContainer />
    <ConfirmModal
      :open="confirmStore.open"
      :title="confirmStore.title"
      :message="confirmStore.message"
      :confirm-text="confirmStore.confirmText"
      :cancel-text="confirmStore.cancelText"
      :type="confirmStore.type"
      @confirm="confirmStore.confirm"
      @cancel="confirmStore.cancel"
    />
  </div>
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import { useConfirmStore } from './stores/confirm'

const confirmStore = useConfirmStore()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
