<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-for="(element, idx) in paths" :key="idx">
      <path
        v-if="element[0] === 'path'"
        :d="element[1].d"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <circle
        v-else-if="element[0] === 'circle'"
        :cx="element[1].cx"
        :cy="element[1].cy"
        :r="element[1].r"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <rect
        v-else-if="element[0] === 'rect'"
        :x="element[1].x"
        :y="element[1].y"
        :width="element[1].width"
        :height="element[1].height"
        :rx="element[1].rx"
        :ry="element[1].ry"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <line
        v-else-if="element[0] === 'line'"
        :x1="element[1].x1"
        :y1="element[1].y1"
        :x2="element[1].x2"
        :y2="element[1].y2"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
      <polyline
        v-else-if="element[0] === 'polyline'"
        :points="element[1].points"
        :stroke="color"
        :stroke-width="strokeWidth"
        fill="none"
      />
    </template>
  </svg>
</template>

<script setup>
import { computed } from 'vue'
import {
  Share01Icon,
  SaveIcon,
  PrinterIcon,
  EyeIcon,
  Delete02Icon,
  DocumentAttachmentIcon,
  UserCircle02Icon,
  Search01Icon,
  Calendar01Icon,
  TelephoneIcon,
  Location01Icon,
  Image01Icon,
  PlusSignIcon,
  Edit02Icon,
  Cancel01Icon,
  DocumentValidationIcon,
  ChevronDownIcon,
  Copy01Icon,
  ExternalLinkIcon,
  InformationCircleIcon,
  Login01Icon,
} from '@hugeicons/core-free-icons'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
  color: { type: String, default: 'currentColor' },
  strokeWidth: { type: [Number, String], default: 1.5 },
})

const iconMap = {
  share: Share01Icon,
  save: SaveIcon,
  printer: PrinterIcon,
  eye: EyeIcon,
  trash: Delete02Icon,
  document: DocumentAttachmentIcon,
  user: UserCircle02Icon,
  search: Search01Icon,
  calendar: Calendar01Icon,
  phone: TelephoneIcon,
  location: Location01Icon,
  image: Image01Icon,
  plus: PlusSignIcon,
  edit: Edit02Icon,
  close: Cancel01Icon,
  'doc-check': DocumentValidationIcon,
  'chevron-down': ChevronDownIcon,
  copy: Copy01Icon,
  external: ExternalLinkIcon,
  info: InformationCircleIcon,
  login: Login01Icon,
}

const paths = computed(() => {
  const icon = iconMap[props.name]
  if (!icon) return []
  return icon
})
</script>
