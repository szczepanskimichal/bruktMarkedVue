<template>
  <div class="card hover:shadow-lg transition-shadow duration-300 group">
    <div class="relative overflow-hidden rounded-t-lg">
      <!-- Product Image -->
      <img
        :src="product.images?.[0] || '/api/placeholder/300/400'"
        :alt="product.title"
        class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        @click="goToProduct"
      >
      
      <!-- Like Button -->
      <button
        @click.stop="toggleLike"
        class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center transition-colors duration-200"
        :class="isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400 hover:text-red-500'"
      >
        <SimpleIcon 
          :name="isLiked ? 'mdi:heart' : 'mdi:heart-outline'" 
          class="w-5 h-5"
        />
      </button>

      <!-- Status Badge -->
      <div 
        v-if="product.status !== 'active'"
        class="absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium text-white"
        :class="{
          'bg-red-500': product.status === 'sold',
          'bg-yellow-500': product.status === 'reserved',
          'bg-gray-500': product.status === 'hidden'
        }"
      >
        {{ getStatusText(product.status) }}
      </div>

      <!-- Quick Actions (visible on hover) -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex space-x-2">
          <button
            @click.stop="goToProduct"
            class="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <SimpleIcon name="mdi:eye" class="w-4 h-4" />
          </button>
          <button
            v-if="canMessage"
            @click.stop="openChat"
            class="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <SimpleIcon name="mdi:message" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <!-- Title and Price -->
      <div class="flex justify-between items-start mb-2">
        <h3 
          class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
          @click="goToProduct"
        >
          {{ product.title }}
        </h3>
        <div class="text-right ml-2 flex-shrink-0">
          <div class="text-xl font-bold text-green-600">
            {{ formatPrice(product.price) }} kr
          </div>
        </div>
      </div>

      <!-- Product Details -->
      <div class="flex flex-wrap gap-2 mb-3">
        <span 
          v-if="product.size"
          class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
        >
          {{ product.size }}
        </span>
        <span 
          v-if="product.condition"
          class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded"
        >
          {{ product.condition }}
        </span>
        <span 
          v-if="product.brand"
          class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded"
        >
          {{ product.brand }}
        </span>
      </div>

      <!-- Seller Info -->
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <div class="flex items-center space-x-2">
          <img
            :src="product.seller?.avatar || '/api/placeholder/24/24'"
            :alt="product.seller?.username"
            class="w-6 h-6 rounded-full"
          >
          <span>{{ product.seller?.username }}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <!-- Likes count -->
          <div class="flex items-center space-x-1">
            <SimpleIcon name="mdi:heart" class="w-4 h-4 text-red-500" />
            <span>{{ product.likes || 0 }}</span>
          </div>
          
          <!-- Views count -->
          <div class="flex items-center space-x-1">
            <SimpleIcon name="mdi:eye" class="w-4 h-4" />
            <span>{{ product.views || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Time since posted -->
      <div class="mt-2 text-xs text-gray-500 dark:text-gray-500">
        {{ formatTimeAgo(product.createdAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '~/stores/favorites'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'

interface Product {
  id: string
  title: string
  price: number
  images?: string[]
  condition?: string
  size?: string
  brand?: string
  status: string
  views?: number
  likes?: number
  createdAt: string
  seller?: {
    id: string
    username: string
    avatar?: string
  }
}

interface Props {
  product: Product
}

const props = defineProps<Props>()

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const chatStore = useChatStore()

const { user } = storeToRefs(authStore)

const isLiked = computed(() => {
  return favoritesStore.isLiked(props.product.id)
})

const canMessage = computed(() => {
  return user.value && props.product.seller && user.value.id !== props.product.seller.id
})

const toggleLike = async () => {
  if (!user.value) {
    // Redirect to login
    navigateTo('/logowanie')
    return
  }

  try {
    if (isLiked.value) {
      await favoritesStore.removeFavorite(props.product.id)
    } else {
      await favoritesStore.addFavorite(props.product.id)
    }
  } catch (error) {
    console.error('Failed to toggle like:', error)
    // Show notification
  }
}

const goToProduct = () => {
  navigateTo(`/produkt/${props.product.id}`)
}

const openChat = () => {
  if (!user.value || !props.product.seller) return
  
  chatStore.openChat({
    userId: props.product.seller.id,
    username: props.product.seller.username,
    avatar: props.product.seller.avatar,
    productId: props.product.id
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    sold: 'Sprzedane',
    reserved: 'Zarezerwowane',
    hidden: 'Ukryte'
  }
  return statusMap[status] || status
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('nb-NO').format(price)
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffDays > 7) {
    return date.toLocaleDateString('pl-PL')
  } else if (diffDays > 0) {
    return `${diffDays} dni temu`
  } else if (diffHours > 0) {
    return `${diffHours} godz. temu`
  } else if (diffMinutes > 0) {
    return `${diffMinutes} min. temu`
  } else {
    return 'Przed chwilą'
  }
}
</script>