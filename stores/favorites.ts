import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<Set<string>>(new Set())
  const isLoading = ref(false)

  // Load favorites from localStorage on client
  const loadFavorites = () => {
    if (process.client) {
      const saved = localStorage.getItem('favorites')
      if (saved) {
        favorites.value = new Set(JSON.parse(saved))
      }
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (process.client) {
      localStorage.setItem('favorites', JSON.stringify([...favorites.value]))
    }
  }

  // Add to favorites
  const addFavorite = async (productId: string) => {
    isLoading.value = true
    try {
      // API call to save favorite
      await $fetch('/api/favorites', {
        method: 'POST',
        body: { productId }
      })
      
      favorites.value.add(productId)
      saveFavorites()
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Remove from favorites
  const removeFavorite = async (productId: string) => {
    isLoading.value = true
    try {
      // API call to remove favorite
      await $fetch(`/api/favorites/${productId}`, {
        method: 'DELETE'
      })
      
      favorites.value.delete(productId)
      saveFavorites()
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Check if product is liked
  const isLiked = (productId: string) => {
    return favorites.value.has(productId)
  }

  // Get favorites count
  const count = computed(() => favorites.value.size)

  // Load favorites on store initialization
  loadFavorites()

  return {
    favorites: readonly(favorites),
    isLoading: readonly(isLoading),
    count,
    addFavorite,
    removeFavorite,
    isLiked,
    loadFavorites
  }
})