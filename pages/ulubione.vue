<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Ulubione produkty
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ favoriteProducts.length }} {{ favoriteProducts.length === 1 ? 'produkt' : 'produktów' }}
            </p>
          </div>
          
          <!-- Clear all favorites -->
          <button
            v-if="favoriteProducts.length > 0"
            @click="showClearConfirm = true"
            class="btn-secondary text-sm"
          >
            <SimpleIcon name="mdi:heart-off" class="w-4 h-4 mr-2" />
            Wyczyść wszystkie
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <SimpleIcon name="mdi:loading" class="w-8 h-8 animate-spin text-blue-600" />
      </div>

      <!-- Empty state -->
      <div v-else-if="favoriteProducts.length === 0" class="text-center py-20">
        <SimpleIcon name="mdi:heart-outline" class="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Brak ulubionych produktów
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Dodaj produkty do ulubionych, klikając ikonę serca na produktach
        </p>
        <NuxtLink to="/produkty" class="btn-primary">
          <SimpleIcon name="mdi:magnify" class="w-5 h-5 mr-2" />
          Przeglądaj produkty
        </NuxtLink>
      </div>

      <!-- Products grid -->
      <div v-else>
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Szukaj w ulubionych..."
              class="form-input"
            >
          </div>
          <select v-model="sortBy" class="form-select">
            <option value="newest">Najnowsze</option>
            <option value="oldest">Najstarsze</option>
            <option value="price-low">Cena: rosnąco</option>
            <option value="price-high">Cena: malejąco</option>
            <option value="title">Alfabetycznie</option>
          </select>
        </div>

        <!-- Products grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="relative group"
          >
            <!-- Remove from favorites button -->
            <button
              @click="removeFavorite(product.id)"
              class="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
              :disabled="favoritesStore.isLoading"
            >
              <SimpleIcon name="mdi:heart" class="w-5 h-5" />
            </button>

            <!-- Product Card -->
            <ProductCard :product="product" />
          </div>
        </div>

        <!-- Pagination if needed -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8">
          <nav class="flex space-x-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Clear confirmation modal -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showClearConfirm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Usuń wszystkie ulubione?
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Ta akcja nie może być cofnięta. Wszystkie produkty zostaną usunięte z Twoich ulubionych.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showClearConfirm = false"
            class="btn-secondary"
          >
            Anuluj
          </button>
          <button
            @click="clearAllFavorites"
            class="btn-danger"
            :disabled="isClearing"
          >
            <SimpleIcon 
              v-if="isClearing" 
              name="mdi:loading" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            {{ isClearing ? 'Usuwanie...' : 'Usuń wszystkie' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  size?: string
  condition: string
  color?: string
  brand?: string
  images: string[]
  status: string
  views: number
  createdAt: string
  updatedAt: string
  sellerId: string
  seller: {
    id: string
    username: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  _count: {
    likes: number
  }
}

// Meta tags
useHead({
  title: 'Ulubione produkty - BruktMarked',
  meta: [
    { name: 'description', content: 'Przeglądaj swoje ulubione produkty na BruktMarked' }
  ]
})

// Stores
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Redirect if not logged in
if (!authStore.isAuthenticated) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Musisz być zalogowany, aby zobaczyć ulubione produkty'
  })
}

// State
const isLoading = ref(true)
const favoriteProducts = ref<any[]>([])
const searchQuery = ref('')
const sortBy = ref('newest')
const showClearConfirm = ref(false)
const isClearing = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

// Load favorite products
const loadFavoriteProducts = async () => {
  if (!authStore.user) return
  
  isLoading.value = true
  try {
    // Get favorite products from API
    const data = await $fetch('/api/favorites/list', {
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {}
    })
    
    favoriteProducts.value = data.products || []
  } catch (error) {
    console.error('Failed to load favorite products:', error)
    notificationStore.error('Błąd', 'Nie udało się załadować ulubionych produktów')
  } finally {
    isLoading.value = false
  }
}

// Filter and sort products
const filteredProducts = computed(() => {
  let products = [...favoriteProducts.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(product =>
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }
  
  // Sort
  products.sort((a, b) => {
    switch (sortBy.value) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'title':
        return a.title.localeCompare(b.title)
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
  
  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  return products.slice(start, start + itemsPerPage)
})

// Pagination
const totalPages = computed(() => {
  const filtered = favoriteProducts.value.filter(product => {
    if (!searchQuery.value) return true
    const query = searchQuery.value.toLowerCase()
    return product.title.toLowerCase().includes(query) ||
           product.description.toLowerCase().includes(query) ||
           product.category.toLowerCase().includes(query)
  })
  return Math.ceil(filtered.length / itemsPerPage)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }
  
  return pages
})

// Remove single favorite
const removeFavorite = async (productId: string) => {
  try {
    await favoritesStore.removeFavorite(productId, authStore.token || undefined)
    // Remove from local list
    favoriteProducts.value = favoriteProducts.value.filter(p => p.id !== productId)
    notificationStore.success('Usunięto', 'Produkt usunięty z ulubionych')
  } catch (error) {
    notificationStore.error('Błąd', 'Nie udało się usunąć produktu z ulubionych')
  }
}

// Clear all favorites
const clearAllFavorites = async () => {
  isClearing.value = true
  try {
    // Remove all favorites
    const promises = [...favoritesStore.favorites].map(id => 
      favoritesStore.removeFavorite(id, authStore.token || undefined).catch(() => {}) // Ignore individual errors
    )
    
    await Promise.allSettled(promises)
    
    favoriteProducts.value = []
    showClearConfirm.value = false
    notificationStore.success('Usunięto', 'Wszystkie ulubione produkty zostały usunięte')
  } catch (error) {
    notificationStore.error('Błąd', 'Nie udało się usunąć wszystkich produktów')
  } finally {
    isClearing.value = false
  }
}

// Reset pagination when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

// Load data on mount
onMounted(() => {
  loadFavoriteProducts()
})

// Reload when favorites change
watch(() => favoritesStore.count, () => {
  if (favoriteProducts.value.length > favoritesStore.count) {
    loadFavoriteProducts()
  }
})
</script>