<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Tylko minimalna nawigacja -->
    <div class="absolute top-4 left-4">
      <NuxtLink to="/" class="text-blue-600 hover:text-blue-500 font-medium">
        ← Powrót do strony głównej
      </NuxtLink>
    </div>

    <!-- Przełącznik języka w prawym rogu -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    
    <!-- Główna zawartość -->
    <slot />
  </div>
</template>

<script setup lang="ts">
// Auth layout - minimalistyczny layout dla logowania/rejestracji
</script>