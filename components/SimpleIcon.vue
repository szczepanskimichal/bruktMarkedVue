<template>
  <span v-if="name === 'mdi:shopping'" class="inline-block" :class="sizeClass">🛍️</span>
  <span v-else-if="name === 'mdi:magnify'" class="inline-block" :class="sizeClass">🔍</span>
  <span v-else-if="name === 'mdi:eye'" class="inline-block" :class="sizeClass">👁️</span>
  <span v-else-if="name === 'mdi:eye-off'" class="inline-block" :class="sizeClass">🙈</span>
  <span v-else-if="name === 'mdi:loading'" class="inline-block" :class="sizeClass">⏳</span>
  <span v-else-if="name === 'mdi:alert-circle'" class="inline-block" :class="sizeClass">⚠️</span>
  <span v-else-if="name === 'mdi:check'" class="inline-block" :class="sizeClass">✅</span>
  <span v-else-if="name === 'mdi:close'" class="inline-block" :class="sizeClass">❌</span>
  <span v-else-if="name === 'mdi:heart'" class="inline-block" :class="sizeClass">❤️</span>
  <span v-else-if="name === 'mdi:heart-outline'" class="inline-block" :class="sizeClass">🤍</span>
  <span v-else-if="name === 'mdi:plus'" class="inline-block" :class="sizeClass">➕</span>
  <span v-else-if="name === 'mdi:edit'" class="inline-block" :class="sizeClass">✏️</span>
  <span v-else-if="name === 'mdi:delete'" class="inline-block" :class="sizeClass">🗑️</span>
  <span v-else-if="name === 'mdi:menu'" class="inline-block" :class="sizeClass">☰</span>
  <span v-else-if="name === 'mdi:user'" class="inline-block" :class="sizeClass">👤</span>
  <span v-else-if="name === 'mdi:logout'" class="inline-block" :class="sizeClass">🚪</span>
  <span v-else-if="name === 'mdi:message'" class="inline-block" :class="sizeClass">💬</span>
  <span v-else-if="name === 'mdi:send'" class="inline-block" :class="sizeClass">📤</span>
  <span v-else-if="name === 'mdi:image'" class="inline-block" :class="sizeClass">🖼️</span>
  <span v-else-if="name === 'mdi:view-grid'" class="inline-block" :class="sizeClass">⚏</span>
  <span v-else-if="name === 'mdi:chevron-down'" class="inline-block" :class="sizeClass">⌄</span>
  <span v-else-if="name === 'mdi:account'" class="inline-block" :class="sizeClass">👤</span>
  <span v-else-if="name === 'mdi:package-variant'" class="inline-block" :class="sizeClass">📦</span>
  <span v-else-if="name === 'mdi:shield-account'" class="inline-block" :class="sizeClass">🛡️</span>
  <span v-else-if="name === 'mdi:facebook'" class="inline-block" :class="sizeClass">📘</span>
  <span v-else-if="name === 'mdi:instagram'" class="inline-block" :class="sizeClass">📷</span>
  <span v-else-if="name === 'mdi:twitter'" class="inline-block" :class="sizeClass">🐦</span>
  <span v-else-if="name === 'mdi:google'" class="inline-block" :class="sizeClass">🌐</span>
  <span v-else-if="name === 'simple-icons:vipps'" class="inline-block" :class="sizeClass">💳</span>
  <span v-else-if="name === 'mdi:chevron-left'" class="inline-block" :class="sizeClass">‹</span>
  <span v-else-if="name === 'mdi:chevron-right'" class="inline-block" :class="sizeClass">›</span>
  <span v-else-if="name === 'mdi:view-list'" class="inline-block" :class="sizeClass">☰</span>
  <span v-else class="inline-block" :class="sizeClass">❓</span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  class?: string
}

const props = defineProps<Props>()

const sizeClass = computed(() => {
  const classes = props.class || ''
  
  // Convert Tailwind size classes to appropriate text size
  if (classes.includes('w-4 h-4') || classes.includes('w-5 h-5')) {
    return 'text-sm'
  } else if (classes.includes('w-6 h-6')) {
    return 'text-base'
  } else if (classes.includes('w-8 h-8')) {
    return 'text-xl'
  } else if (classes.includes('w-12 h-12')) {
    return 'text-3xl'
  }
  
  return 'text-base'
})
</script>