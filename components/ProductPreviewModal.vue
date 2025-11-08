<template>
  <!-- Modal Backdrop -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <!-- Modal Content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Szybki podgląd
        </h2>
        <button
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <SimpleIcon name="mdi:close" class="w-6 h-6" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Product Images -->
          <div>
            <!-- Main Image -->
            <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
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
                class="aspect-square bg-gray-100 dark:bg-gray-700 rounded border-2 overflow-hidden"
                :class="{ 'border-blue-500': selectedImage === image, 'border-transparent': selectedImage !== image }"
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
          <div class="space-y-4">
            <!-- Title and Price -->
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ product.title }}
              </h3>
              <div class="text-3xl font-bold text-green-600">
                {{ formatPrice(product.price) }} kr
              </div>
            </div>

            <!-- Product Details -->
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <span class="text-gray-600 dark:text-gray-400 w-20">Kategoria:</span>
                <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded">
                  {{ getCategoryName(product.category) }}
                </span>
              </div>

              <div v-if="product.size" class="flex items-center space-x-4">
                <span class="text-gray-600 dark:text-gray-400 w-20">Rozmiar:</span>
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded">
                  {{ product.size }}
                </span>
              </div>

              <div class="flex items-center space-x-4">
                <span class="text-gray-600 dark:text-gray-400 w-20">Stan:</span>
                <span class="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm rounded">
                  {{ product.condition }}
                </span>
              </div>

              <div v-if="product.brand" class="flex items-center space-x-4">
                <span class="text-gray-600 dark:text-gray-400 w-20">Marka:</span>
                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded">
                  {{ product.brand }}
                </span>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Opis:</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {{ product.description.substring(0, 200) }}{{ product.description.length > 200 ? '...' : '' }}
              </p>
            </div>

            <!-- Seller Info -->
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Sprzedawca:</h4>
              <div class="flex items-center space-x-3">
                <img
                  :src="product.seller.avatar || '/api/placeholder/40/40'"
                  :alt="product.seller.username"
                  class="w-8 h-8 rounded-full"
                >
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ product.seller.firstName }} {{ product.seller.lastName }}
                  </p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    @{{ product.seller.username }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Stats -->
            <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <SimpleIcon name="mdi:heart" class="w-4 h-4 text-red-500" />
                <span>{{ product._count.likes }}</span>
              </div>
              <div class="flex items-center space-x-1">
                <SimpleIcon name="mdi:eye" class="w-4 h-4" />
                <span>{{ product.views }}</span>
              </div>
              <div>
                {{ formatDate(product.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex space-x-3">
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
              class="w-4 h-4" 
            />
            <span class="text-sm">{{ isLiked ? 'Usuń z ulubionych' : 'Dodaj do ulubionych' }}</span>
          </button>

          <button
            @click="shareProduct"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <SimpleIcon name="mdi:share-variant" class="w-4 h-4" />
            <span class="text-sm">Udostępnij</span>
          </button>
        </div>

        <div class="flex space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Zamknij
          </button>
          <button
            @click="goToProduct"
            class="btn-primary"
          >
            Zobacz szczegóły
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'
import type { Product } from '~/types'

interface Props {
  product: Product | null
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Stores
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// State
const selectedImage = ref('')

// Computed
const isLiked = computed(() => {
  return props.product ? favoritesStore.isLiked(props.product.id) : false
})

// Watch for product changes
watch(() => props.product, (newProduct) => {
  if (newProduct && newProduct.images.length > 0) {
    selectedImage.value = newProduct.images[0] || ''
  }
}, { immediate: true })

// Methods
const closeModal = () => {
  emit('close')
}

const toggleLike = async () => {
  if (!user.value) {
    closeModal()
    navigateTo('/logowanie')
    return
  }

  if (!props.product) return

  try {
    if (isLiked.value) {
      await favoritesStore.removeFavorite(props.product.id, authStore.token || undefined)
      notificationStore.success('Usunięto z ulubionych', '')
    } else {
      await favoritesStore.addFavorite(props.product.id, authStore.token || undefined)
      notificationStore.success('Dodano do ulubionych', '')
    }
  } catch (err) {
    notificationStore.error('Błąd', 'Nie udało się zaktualizować ulubionych')
  }
}

const shareProduct = async () => {
  if (!props.product) return

  const url = `${window.location.origin}/produkt/${props.product.id}`
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.product.title,
        text: props.product.description.substring(0, 100),
        url: url
      })
    } catch (err) {
      // User cancelled sharing
    }
  } else {
    // Fallback - copy to clipboard
    try {
      await navigator.clipboard.writeText(url)
      notificationStore.success('Link skopiowany', 'Link do produktu został skopiowany do schowka')
    } catch (err) {
      notificationStore.error('Błąd', 'Nie udało się skopiować linku')
    }
  }
}

const goToProduct = () => {
  if (props.product) {
    closeModal()
    navigateTo(`/produkt/${props.product.id}`)
  }
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
</script>