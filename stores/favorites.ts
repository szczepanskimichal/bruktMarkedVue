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

  // Load favorites from backend
  const loadFavoritesFromAPI = async (token?: string) => {
    if (!token) return
    
    isLoading.value = true
    try {
      const data = await $fetch('/api/favorites/list', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      const favoriteIds = data.products.map((p: any) => p.id)
      favorites.value = new Set(favoriteIds)
      saveFavorites()
    } catch (error) {
      console.error('Failed to load favorites from API:', error)
      // Fall back to localStorage
      loadFavorites()
    } finally {
      isLoading.value = false
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    if (process.client) {
      localStorage.setItem('favorites', JSON.stringify([...favorites.value]))
    }
  }

  // Add to favorites
  const addFavorite = async (productId: string, token?: string) => {
    isLoading.value = true
    try {
      // API call to save favorite
      await $fetch('/api/favorites', {
        method: 'POST',
        body: { productId },
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {}
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
  const removeFavorite = async (productId: string, token?: string) => {
    isLoading.value = true
    try {
      // API call to remove favorite
      await $fetch(`/api/favorites/${productId}`, {
        method: 'DELETE',
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {}
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
    loadFavorites,
    loadFavoritesFromAPI
  }
})