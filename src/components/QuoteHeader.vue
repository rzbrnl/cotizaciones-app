<template>
  <div class="header-banner">
    <div class="header-left">
      <h1 class="header-title">Cotización</h1>
      <div class="header-date">{{ data.date }}</div>
    </div>
    <div class="header-logo">
      <div class="logo-img-wrap">
        <img v-if="logo" :src="logo" alt="Logo" class="logo-img" />
        <div v-else class="logo-placeholder">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  data: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
})

const auth = useAuthStore()
const logo = computed(() => auth.userLogo)
</script>

<style scoped>
.header-banner {
  background: var(--black);
  padding: 36px 48px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-title {
  font-family: 'Google Sans', sans-serif;
  font-size: 2.4rem;
  color: var(--white);
  font-weight: 400;
  letter-spacing: 0.5px;
  margin: 0;
}

.header-date {
  font-family: 'Google Sans', sans-serif;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  letter-spacing: 0.5px;
  padding: 2px 6px;
}

.header-logo {
  text-align: right;
}

.logo-img-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.logo-placeholder {
  width: 80px;
  height: 80px;
  border: 1px dashed rgba(255,255,255,0.25);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.3);
}

@media (max-width: 600px) {
  .header-banner { padding: 24px; }
  .header-title { font-size: 1.8rem; }
  .logo-img-wrap { width: 60px; height: 60px; }
}
</style>
