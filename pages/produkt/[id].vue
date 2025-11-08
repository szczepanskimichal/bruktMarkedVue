<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <SimpleIcon name="mdi:loading" class="w-8 h-8 animate-spin text-blue-600" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <SimpleIcon name="mdi:alert-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Produkt nie został znaleziony
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <NuxtLink to="/produkty" class="btn-primary">
        <SimpleIcon name="mdi:arrow-left" class="w-5 h-5 mr-2" />
        Powrót do produktów
      </NuxtLink>
    </div>

    <!-- Product Details -->
    <div v-else-if="product" class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Breadcrumb -->
      <nav class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li><NuxtLink to="/" class="hover:text-blue-600">Strona główna</NuxtLink></li>
          <li><SimpleIcon name="mdi:chevron-right" class="w-4 h-4" /></li>
          <li><NuxtLink to="/produkty" class="hover:text-blue-600">Produkty</NuxtLink></li>
          <li><SimpleIcon name="mdi:chevron-right" class="w-4 h-4" /></li>
          <li class="text-gray-900 dark:text-white">{{ product.title }}</li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <!-- Product Images -->
        <div>
          <!-- Main Image -->
          <div class="aspect-square bg-white rounded-lg shadow-sm overflow-hidden mb-4">
            <img
              :src="selectedImage"
              :alt="product.title"
              class="w-full h-full object-cover"
            >
          </div>

          <!-- Thumbnail Images -->
          <div v-if="product.images.length > 1" class="grid grid-cols-4 gap-2">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              class="aspect-square bg-white rounded border-2 overflow-hidden"
              :class="{ 'border-blue-500': selectedImage === image, 'border-gray-200': selectedImage !== image }"
            >
              <img
                :src="image"
                :alt="`${product.title} - zdjęcie ${index + 1}`"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div>
          <!-- Title and Price -->
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {{ product.title }}
            </h1>
            <div class="flex items-center justify-between mb-4">
              <div class="text-3xl font-bold text-green-600">
                {{ formatPrice(product.price) }} kr
              </div>
              <button
                @click="toggleLike"
                :disabled="favoritesStore.isLoading"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"
                :class="isLiked 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                <SimpleIcon 
                  :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'" 
                  class="w-5 h-5" 
                />
                <span>{{ isLiked ? 'Usuń z ulubionych' : 'Dodaj do ulubionych' }}</span>
              </button>
            </div>
          </div>

          <!-- Product Details -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center space-x-4">
              <span class="text-gray-600 dark:text-gray-400">Kategoria:</span>
              <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                {{ getCategoryName(product.category) }}
              </span>
            </div>

            <div v-if="product.size" class="flex items-center space-x-4">
              <span class="text-gray-600 dark:text-gray-400">Rozmiar:</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {{ product.size }}
              </span>
            </div>

            <div class="flex items-center space-x-4">
              <span class="text-gray-600 dark:text-gray-400">Stan:</span>
              <span class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                {{ product.condition }}
              </span>
            </div>

            <div v-if="product.brand" class="flex items-center space-x-4">
              <span class="text-gray-600 dark:text-gray-400">Marka:</span>
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                {{ product.brand }}
              </span>
            </div>

            <div v-if="product.color" class="flex items-center space-x-4">
              <span class="text-gray-600 dark:text-gray-400">Kolor:</span>
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {{ product.color }}
              </span>
            </div>
          </div>

          <!-- Seller Info -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sprzedawca
            </h3>
            <div class="flex items-center space-x-4">
              <img
                :src="product.seller.avatar || '/api/placeholder/64/64'"
                :alt="product.seller.username"
                class="w-12 h-12 rounded-full"
              >
              <div class="flex-1">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ product.seller.firstName }} {{ product.seller.lastName }}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  @{{ product.seller.username }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-4">
            <button
              v-if="canMessage"
              @click="startConversation"
              class="w-full btn-primary"
            >
              <SimpleIcon name="mdi:message" class="w-5 h-5 mr-2" />
              Napisz do sprzedawcy
            </button>

            <div v-else-if="!authStore.isAuthenticated" class="text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Zaloguj się, aby skontaktować się ze sprzedawcą
              </p>
              <NuxtLink to="/logowanie" class="btn-primary">
                Zaloguj się
              </NuxtLink>
            </div>

            <div v-else-if="isOwnProduct" class="text-center">
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                To jest Twój produkt
              </p>
              <NuxtLink to="/moje-produkty" class="btn-secondary">
                Zarządzaj produktami
              </NuxtLink>
            </div>
          </div>

          <!-- Product Stats -->
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-1">
                <SimpleIcon name="mdi:heart" class="w-4 h-4 text-red-500" />
                <span>{{ product._count.likes }} polubień</span>
              </div>
              <div class="flex items-center space-x-1">
                <SimpleIcon name="mdi:eye" class="w-4 h-4" />
                <span>{{ product.views }} wyświetleń</span>
              </div>
            </div>
            <div>
              Dodano {{ formatDate(product.createdAt) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Product Description -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Opis produktu
        </h2>
        <div class="prose max-w-none text-gray-600 dark:text-gray-400">
          <p class="whitespace-pre-wrap">{{ product.description }}</p>
        </div>
      </div>

      <!-- Similar Products -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Podobne produkty
        </h2>
        <div v-if="similarProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            :product="similarProduct"
          />
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          Brak podobnych produktów
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useNotificationStore } from '~/stores/notifications'
import type { Product } from '~/types'

// Meta tags
definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string'
  }
})

// Stores
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// Route params
const route = useRoute()
const productId = route.params.id as string

// State
const product = ref<Product | null>(null)
const similarProducts = ref<Product[]>([])
const selectedImage = ref('')
const isLoading = ref(true)
const error = ref('')

// Computed
const isLiked = computed(() => {
  return product.value ? favoritesStore.isLiked(product.value.id) : false
})

const canMessage = computed(() => {
  return user.value && 
         product.value && 
         product.value.seller && 
         user.value.id !== product.value.seller.id
})

const isOwnProduct = computed(() => {
  return user.value && 
         product.value && 
         user.value.id === product.value.sellerId
})

// Methods
const loadProduct = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<Product>(`/api/products/${productId}`)
    product.value = data
    selectedImage.value = data.images[0] || '/api/placeholder/400/400'
    
    // Update page title
    useHead({
      title: `${data.title} - BruktMarked`,
      meta: [
        { name: 'description', content: data.description.substring(0, 160) }
      ]
    })

    // Load similar products
    loadSimilarProducts()
    
    // Increment view count
    incrementViewCount()
  } catch (err: any) {
    error.value = err.statusMessage || 'Nie udało się załadować produktu'
  } finally {
    isLoading.value = false
  }
}

const loadSimilarProducts = async () => {
  if (!product.value) return
  
  try {
    const data = await $fetch<{products: Product[]}>('/api/products/list', {
      query: {
        category: product.value.category,
        limit: 4
      }
    })
    
    // Filter out current product
    similarProducts.value = data.products.filter(p => p.id !== product.value!.id)
  } catch (err) {
    console.error('Failed to load similar products:', err)
  }
}

const incrementViewCount = async () => {
  if (!product.value) return
  
  try {
    await $fetch(`/api/products/${productId}/view`, {
      method: 'POST'
    })
  } catch (err) {
    console.error('Failed to increment view count:', err)
  }
}

const toggleLike = async () => {
  if (!user.value) {
    navigateTo('/logowanie')
    return
  }

  if (!product.value) return

  try {
    if (isLiked.value) {
      await favoritesStore.removeFavorite(product.value.id, authStore.token || undefined)
    } else {
      await favoritesStore.addFavorite(product.value.id, authStore.token || undefined)
    }
  } catch (err) {
    notificationStore.error('Błąd', 'Nie udało się zaktualizować ulubionych')
  }
}

const startConversation = () => {
  if (!product.value) return
  navigateTo(`/wiadomosci?user=${product.value.seller.id}&product=${product.value.id}`)
}

const getCategoryName = (category: string) => {
  const categories: Record<string, string> = {
    'koszulki': 'Koszulki i bluzki',
    'spodnie': 'Spodnie i jeansy',
    'sukienki': 'Sukienki',
    'buty': 'Buty',
    'kurtki': 'Kurtki i płaszcze',
    'swetry': 'Swetry i kardigany',
    'spodnice': 'Spódnice',
    'akcesoria': 'Akcesoria',
    'bielizna': 'Bielizna',
    'sportowe': 'Odzież sportowa',
    'inne': 'Inne'
  }
  return categories[category] || category
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('nb-NO').format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Load data on mount
onMounted(() => {
  loadProduct()
})
</script>