<template>
  <div class="skeleton" :class="[variant, { animated }]" :style="style" />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'text' },
  width: { type: String, default: null },
  height: { type: String, default: null },
  animated: { type: Boolean, default: true },
})

const style = computed(() => ({
  width: props.width,
  height: props.height || (props.variant === 'circle' ? props.width : undefined),
}))
</script>

<style scoped>
.skeleton {
  background: #e5e7eb;
  border-radius: 6px;
}

.skeleton.text {
  height: 14px;
  margin-bottom: 8px;
}

.skeleton.title {
  height: 22px;
  width: 60%;
  margin-bottom: 12px;
}

.skeleton.circle {
  border-radius: 50%;
}

.skeleton.rect {
  border-radius: 8px;
}

.skeleton.animated {
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
