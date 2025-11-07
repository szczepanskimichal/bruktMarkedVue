<template>
  <div style="position: relative; display: inline-block;" data-language-switcher>
    <button 
      @click="toggleDropdown"
      style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-size: 14px; transition: background-color 0.2s;"
      :style="{ backgroundColor: showDropdown ? '#f3f4f6' : 'white' }"
    >
      <span>{{ currentFlag }}</span>
      <span>{{ currentLanguage }}</span>
      <svg style="width: 12px; height: 12px; transition: transform 0.2s;" :style="{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
    
    <div 
      v-if="showDropdown" 
      style="position: absolute; top: 100%; left: 0; background: white; border: 1px solid #d1d5db; border-radius: 6px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 50; min-width: 120px; margin-top: 4px;"
    >
      <button
        v-for="lang in availableLanguages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 12px; text-align: left; border: none; background: none; cursor: pointer; font-size: 14px; transition: background-color 0.2s;"
        :style="{
          backgroundColor: locale === lang.code ? '#e5e7eb' : 'transparent',
          fontWeight: locale === lang.code ? '600' : '400'
        }"
        @mouseover="hoveredLang = lang.code"
        @mouseout="hoveredLang = null"
      >
        <span>{{ lang.flag }}</span>
        <span>{{ lang.name }}</span>
        <span v-if="locale === lang.code" style="margin-left: auto; color: #2563eb;">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { locale, setLocale, initLocale } = useSimpleI18n()
const showDropdown = ref(false)
const hoveredLang = ref<string | null>(null)

const availableLanguages = [
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' }
]

const currentLanguage = computed(() => {
  const lang = availableLanguages.find(l => l.code === locale.value)
  return lang?.name || 'Norsk'
})

const currentFlag = computed(() => {
  const lang = availableLanguages.find(l => l.code === locale.value)
  return lang?.flag || '🇳🇴'
})

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const changeLanguage = (langCode: string) => {
  setLocale(langCode)
  showDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('[data-language-switcher]')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  initLocale()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>