<template>
  <NuxtLink 
    :to="`/produkty?kategoria=${category.name}`"
    class="group p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
  >
    <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
      <SimpleIcon :name="category.icon" class="w-6 h-6 text-white" />
    </div>
    <h3 class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {{ category.name }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ category.count }} produktów
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Category {
  name: string
  icon: string
  count: number
}

interface Props {
  category: Category
}

defineProps<Props>()
</script>