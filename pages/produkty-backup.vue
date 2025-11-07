<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Wszystkie produkty
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Znajdź idealne ubrania w świetnych cenach
            </p>
          </div>
          
          <!-- Add Product Button -->
          <div class="mt-4 md:mt-0">
            <NuxtLink to="/sprzedaj" class="btn-primary">
              <SimpleIcon name="mdi:plus" class="w-5 h-5 mr-2" />
              Dodaj produkt
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="card p-6 space-y-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Filtry
            </h2>

            <!-- Search -->
            <div>
              <label class="form-label">Wyszukaj</label>
              <div class="relative">
                <input
                  v-model="filters.search"
                  type="text"
                  placeholder="Nazwa, marka..."
                  class="form-input pl-10"
                  @input="debouncedSearch"
                >
                <SimpleIcon 
                  name="mdi:magnify" 
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="form-label">Kategoria</label>
              <select v-model="filters.category" class="form-input" @change="applyFilters">
                <option value="">Wszystkie kategorie</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <!-- Price Range -->
            <div>
              <label class="form-label">Zakres cen (NOK)</label>
              <div class="grid grid-cols-2 gap-2">
                <input
                  v-model.number="filters.minPrice"
                  type="number"
                  placeholder="Od"
                  class="form-input"
                  min="0"
                  @input="debouncedApplyFilters"
                >
                <input
                  v-model.number="filters.maxPrice"
                  type="number"
                  placeholder="Do"
                  class="form-input"
                  min="0"
                  @input="debouncedApplyFilters"
                >
              </div>
            </div>

            <!-- Size -->
            <div>
              <label class="form-label">Rozmiar</label>
              <select v-model="filters.size" class="form-input" @change="applyFilters">
                <option value="">Wszystkie rozmiary</option>
                <option v-for="size in sizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>

            <!-- Condition -->
            <div>
              <label class="form-label">Stan</label>
              <select v-model="filters.condition" class="form-input" @change="applyFilters">
                <option value="">Wszystkie stany</option>
                <option v-for="condition in conditions" :key="condition" :value="condition">
                  {{ condition }}
                </option>
              </select>
            </div>

            <!-- Sort -->
            <div>
              <label class="form-label">Sortuj według</label>
              <select v-model="filters.sort" class="form-input" @change="applyFilters">
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
                <option value="price-low">Cena: rosnąco</option>
                <option value="price-high">Cena: malejąco</option>
                <option value="popular">Najpopularniejsze</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button
              @click="clearFilters"
              class="w-full btn-secondary text-sm"
            >
              Wyczyść filtry
            </button>
          </div>
        </aside>

        <!-- Products Grid -->
        <main class="flex-1">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              <span v-if="!isLoading">
                {{ pagination.count }} {{ pagination.count === 1 ? 'produkt' : 'produktów' }}
              </span>
              <span v-else>Ładowanie...</span>
            </p>
            
            <!-- View Toggle -->
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                class="p-2 rounded"
                :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
              >
                <SimpleIcon name="mdi:view-grid" class="w-5 h-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                class="p-2 rounded"
                :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
              >
                <SimpleIcon name="mdi:view-list" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 9" :key="i" class="card p-4 animate-pulse">
              <div class="bg-gray-300 h-64 rounded mb-4"></div>
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded w-3/4"></div>
            </div>
          </div>

          <!-- Products Grid -->
          <div 
            v-else-if="products.length > 0"
            class="grid gap-6"
            :class="{
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': viewMode === 'grid',
              'grid-cols-1': viewMode === 'list'
            }"
          >
            <ProductCard 
              v-for="product in products"
              :key="product.id"
              :product="product"
              :view-mode="viewMode"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <SimpleIcon name="mdi:package-variant" class="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Brak produktów
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Nie znaleziono produktów spełniających kryteria wyszukiwania.
            </p>
            <button @click="clearFilters" class="btn-primary">
              Wyczyść filtry
            </button>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.total > 1 && !isLoading" class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                @click="goToPage(pagination.current - 1)"
                :disabled="pagination.current <= 1"
                class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SimpleIcon name="mdi:chevron-left" class="w-5 h-5" />
              </button>
              
              <template v-for="page in visiblePages" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  class="px-3 py-2 rounded-md border text-sm font-medium"
                  :class="page === pagination.current 
                    ? 'border-blue-500 bg-blue-600 text-white' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
                >
                  {{ page }}
                </button>
                <span v-else class="px-3 py-2 text-gray-500">...</span>
              </template>
              
              <button
                @click="goToPage(pagination.current + 1)"
                :disabled="pagination.current >= pagination.total"
                class="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SimpleIcon name="mdi:chevron-right" class="w-5 h-5" />
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'

// Meta tags
useHead({
  title: 'Produkty - BruktMarked',
  meta: [
    { name: 'description', content: 'Przeglądaj wszystkie produkty w BruktMarked. Znajdź idealne ubrania w świetnych cenach.' }
  ]
})

const route = useRoute()
const router = useRouter()

const products = ref([])
const isLoading = ref(true)
const viewMode = ref('grid')

const filters = reactive({
  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  size: '',
  condition: '',
  sort: 'newest'
})

const pagination = reactive({
  current: 1,
  total: 1,
  count: 0,
  limit: 20
})

const categories = [
  'koszulki', 'spodnie', 'sukienki', 'buty', 'kurtki', 
  'akcesoria', 'bielizna', 'sportowe'
]

const sizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'
]

const conditions = [
  'nowy', 'bardzo dobry', 'dobry', 'zadowalający'
]

// Computed properties
const visiblePages = computed(() => {
  const current = pagination.current
  const total = pagination.total
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const fetchProducts = async () => {
  isLoading.value = true
  
  try {
    const query = new URLSearchParams()
    
    if (filters.search) query.append('szukaj', filters.search)
    if (filters.category) query.append('kategoria', filters.category)
    if (filters.minPrice) query.append('minCena', filters.minPrice.toString())
    if (filters.maxPrice) query.append('maxCena', filters.maxPrice.toString())
    if (filters.size) query.append('rozmiar', filters.size)
    if (filters.condition) query.append('stan', filters.condition)
    
    query.append('strona', pagination.current.toString())
    query.append('limit', pagination.limit.toString())
    
    // Add sort logic
    const sortMap = {
      newest: 'createdAt:desc',
      oldest: 'createdAt:asc', 
      'price-low': 'price:asc',
      'price-high': 'price:desc',
      popular: 'likes:desc'
    }
    query.append('sort', sortMap[filters.sort] || 'createdAt:desc')
    
    const response = await $fetch(`/api/products?${query}`)
    
    products.value = response.products
    pagination.current = response.pagination.current
    pagination.total = response.pagination.total
    pagination.count = response.pagination.count
  } catch (error) {
    console.error('Failed to fetch products:', error)
    products.value = []
    pagination.count = 0
  } finally {
    isLoading.value = false
  }
}

const applyFilters = () => {
  pagination.current = 1
  updateURL()
  fetchProducts()
}

const debouncedApplyFilters = debounce(applyFilters, 500)
const debouncedSearch = debounce(applyFilters, 300)

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    if (key === 'sort') {
      filters[key] = 'newest'
    } else {
      filters[key] = key.includes('Price') ? null : ''
    }
  })
  pagination.current = 1
  updateURL()
  fetchProducts()
}

const goToPage = (page: number) => {
  if (page < 1 || page > pagination.total) return
  pagination.current = page
  updateURL()
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updateURL = () => {
  const query = { ...route.query }
  
  // Update query params
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'newest') {
      query[key] = value.toString()
    } else {
      delete query[key]
    }
  })
  
  if (pagination.current > 1) {
    query.strona = pagination.current.toString()
  } else {
    delete query.strona
  }
  
  router.replace({ query })
}

const loadFiltersFromURL = () => {
  const query = route.query
  
  filters.search = query.szukaj?.toString() || ''
  filters.category = query.kategoria?.toString() || ''
  filters.minPrice = query.minCena ? parseInt(query.minCena.toString()) : null
  filters.maxPrice = query.maxCena ? parseInt(query.maxCena.toString()) : null
  filters.size = query.rozmiar?.toString() || ''
  filters.condition = query.stan?.toString() || ''
  filters.sort = query.sort?.toString() || 'newest'
  
  pagination.current = parseInt(query.strona?.toString() || '1')
}

// Lifecycle
onMounted(() => {
  loadFiltersFromURL()
  fetchProducts()
})

// Watch route changes
watch(() => route.query, () => {
  loadFiltersFromURL()
  fetchProducts()
})
</script>