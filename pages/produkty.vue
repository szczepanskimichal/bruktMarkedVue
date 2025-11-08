<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Produkty
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              {{ productsStore.total }} {{ productsStore.total === 1 ? 'produkt' : 'produktów' }}
            </p>
          </div>
          
          <!-- Add Product Button (only for logged in users) -->
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/sprzedaj"
            class="btn-primary"
          >
            <SimpleIcon name="mdi:plus" class="w-5 h-5 mr-2" />
            Dodaj produkt
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label for="search" class="form-label">Szukaj</label>
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Wpisz nazwę produktu, markę..."
              class="form-input"
            >
          </div>

          <!-- Category -->
          <div>
            <label for="category" class="form-label">Kategoria</label>
            <select id="category" v-model="selectedCategory" class="form-select">
              <option value="">Wszystkie kategorie</option>
              <option value="koszulki">Koszulki i bluzki</option>
              <option value="spodnie">Spodnie i jeansy</option>
              <option value="sukienki">Sukienki</option>
              <option value="buty">Buty</option>
              <option value="kurtki">Kurtki i płaszcze</option>
              <option value="swetry">Swetry i kardigany</option>
              <option value="spodnice">Spódnice</option>
              <option value="akcesoria">Akcesoria</option>
              <option value="bielizna">Bielizna</option>
              <option value="sportowe">Odzież sportowa</option>
              <option value="inne">Inne</option>
            </select>
          </div>

          <!-- Sort -->
          <div>
            <label for="sort" class="form-label">Sortuj</label>
            <select id="sort" v-model="sortBy" class="form-select">
              <option value="createdAt:desc">Najnowsze</option>
              <option value="createdAt:asc">Najstarsze</option>
              <option value="price:asc">Cena: rosnąco</option>
              <option value="price:desc">Cena: malejąco</option>
              <option value="title:asc">Alfabetycznie</option>
            </select>
          </div>
        </div>

        <!-- Price Range -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="minPrice" class="form-label">Cena od (kr)</label>
            <input
              id="minPrice"
              v-model.number="minPrice"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              class="form-input"
            >
          </div>
          
          <div>
            <label for="maxPrice" class="form-label">Cena do (kr)</label>
            <input
              id="maxPrice"
              v-model.number="maxPrice"
              type="number"
              min="0"
              step="1"
              placeholder="1000"
              class="form-input"
            >
          </div>

          <div>
            <label for="condition" class="form-label">Stan</label>
            <select id="condition" v-model="selectedCondition" class="form-select">
              <option value="">Wszystkie stany</option>
              <option value="nowy">Nowy z metkami</option>
              <option value="bardzo dobry">Bardzo dobry</option>
              <option value="dobry">Dobry</option>
              <option value="zadowalający">Zadowalający</option>
            </select>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="resetFilters"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Wyczyść filtry
          </button>
          
          <button
            @click="applyFilters"
            :disabled="productsStore.isLoading"
            class="btn-primary"
          >
            <SimpleIcon 
              v-if="productsStore.isLoading" 
              name="mdi:loading" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            Zastosuj filtry
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productsStore.isLoading && productsStore.products.length === 0" class="flex justify-center items-center py-20">
        <SimpleIcon name="mdi:loading" class="w-8 h-8 animate-spin text-blue-600" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!productsStore.isLoading && productsStore.products.length === 0" class="text-center py-20">
        <SimpleIcon name="mdi:package-variant" class="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Brak produktów
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          {{ hasActiveFilters ? 'Nie znaleziono produktów spełniających kryteria wyszukiwania' : 'Dodaj pierwszy produkt do marketplace' }}
        </p>
        <div class="flex justify-center space-x-4">
          <button v-if="hasActiveFilters" @click="resetFilters" class="btn-secondary">
            Wyczyść filtry
          </button>
          <NuxtLink v-if="authStore.isAuthenticated" to="/sprzedaj" class="btn-primary">
            <SimpleIcon name="mdi:plus" class="w-5 h-5 mr-2" />
            Dodaj produkt
          </NuxtLink>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          <ProductCard
            v-for="product in productsStore.products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="productsStore.hasNextPage" class="text-center">
          <button
            @click="loadMore"
            :disabled="productsStore.isLoading"
            class="btn-secondary"
          >
            <SimpleIcon 
              v-if="productsStore.isLoading" 
              name="mdi:loading" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            {{ productsStore.isLoading ? 'Ładowanie...' : 'Załaduj więcej' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useProductsStore } from '~/stores/products'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useNotificationStore } from '~/stores/notifications'

// Meta tags
useHead({
  title: 'Produkty - BruktMarked',
  meta: [
    { name: 'description', content: 'Przeglądaj produkty na BruktMarked - marketplace dla używanych ubrań' }
  ]
})

// Stores
const productsStore = useProductsStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const notificationStore = useNotificationStore()

// Filter state
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCondition = ref('')
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const sortBy = ref('createdAt:desc')

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedCategory.value || 
         selectedCondition.value || 
         minPrice.value || 
         maxPrice.value
})

// Methods
const applyFilters = async () => {
  const [sortField, sortOrder] = sortBy.value.split(':') as [string, 'asc' | 'desc']
  
  const filters = {
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    condition: selectedCondition.value || undefined,
    minPrice: minPrice.value || undefined,
    maxPrice: maxPrice.value || undefined,
    sortBy: sortField,
    sortOrder
  }

  const result = await productsStore.loadProducts(1, filters)
  if (!result.success) {
    notificationStore.error('Błąd', result.error || 'Nie udało się załadować produktów')
  }
}

const resetFilters = async () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCondition.value = ''
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'createdAt:desc'
  
  productsStore.resetFilters()
  await applyFilters()
}

const loadMore = async () => {
  if (!productsStore.hasNextPage || productsStore.isLoading) return
  
  const result = await productsStore.loadProducts(productsStore.currentPage + 1)
  if (!result.success) {
    notificationStore.error('Błąd', result.error || 'Nie udało się załadować więcej produktów')
  }
}

// Debounced search
let searchTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(applyFilters, 500)
})

// Auto-apply when sort changes
watch(sortBy, () => {
  applyFilters()
})

// Load data on mount
onMounted(async () => {
  // Load favorites if user is logged in
  if (authStore.isAuthenticated) {
    favoritesStore.loadFavoritesFromAPI(authStore.token || undefined)
  }
  
  // Load products
  await applyFilters()
})
</script>