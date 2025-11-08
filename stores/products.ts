import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

interface CreateProductData {
  title: string
  description: string
  price: number
  category: string
  size?: string
  condition: string
  color?: string
  brand?: string
  images?: string[]
}

interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const total = ref(0)
  const filters = ref<ProductFilters>({})

  // Create product
  const createProduct = async (productData: CreateProductData, token: string) => {
    isLoading.value = true
    try {
      const data = await $fetch<{ product: Product; message: string }>('/api/products/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: productData
      })

      // Add to local products list
      products.value.unshift(data.product)
      total.value += 1

      return { success: true, product: data.product }
    } catch (error: any) {
      console.error('Create product error:', error)
      return {
        success: false,
        error: error?.statusMessage || 'Błąd tworzenia produktu'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Delete product
  const deleteProduct = async (productId: string, token: string) => {
    isLoading.value = true
    try {
      await $fetch(`/api/products/${productId}/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Remove from local products list
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value.splice(index, 1)
        total.value -= 1
      }

      return { success: true }
    } catch (error: any) {
      console.error('Delete product error:', error)
      return {
        success: false,
        error: error?.statusMessage || 'Błąd usuwania produktu'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Load products
  const loadProducts = async (page = 1, newFilters: ProductFilters = {}) => {
    isLoading.value = true
    try {
      // Update filters
      filters.value = { ...filters.value, ...newFilters }
      currentPage.value = page

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.value.category && { category: filters.value.category }),
        ...(filters.value.search && { search: filters.value.search }),
        ...(filters.value.minPrice && { minPrice: filters.value.minPrice.toString() }),
        ...(filters.value.maxPrice && { maxPrice: filters.value.maxPrice.toString() }),
        ...(filters.value.condition && { condition: filters.value.condition }),
        ...(filters.value.sortBy && { sortBy: filters.value.sortBy }),
        ...(filters.value.sortOrder && { sortOrder: filters.value.sortOrder })
      })

      const data = await $fetch<{
        products: Product[]
        pagination: {
          page: number
          limit: number
          total: number
          totalPages: number
          hasNext: boolean
          hasPrev: boolean
        }
      }>(`/api/products/list?${queryParams}`)

      if (page === 1) {
        products.value = data.products
      } else {
        products.value.push(...data.products)
      }

      totalPages.value = data.pagination.totalPages
      total.value = data.pagination.total

      return { success: true }
    } catch (error: any) {
      console.error('Load products error:', error)
      return {
        success: false,
        error: error?.statusMessage || 'Błąd ładowania produktów'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Reset filters
  const resetFilters = () => {
    filters.value = {}
    currentPage.value = 1
  }

  // Computed
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  return {
    // State
    products: readonly(products),
    isLoading: readonly(isLoading),
    currentPage: readonly(currentPage),
    totalPages: readonly(totalPages),
    total: readonly(total),
    filters: readonly(filters),

    // Computed
    hasNextPage,
    hasPrevPage,

    // Actions
    createProduct,
    deleteProduct,
    loadProducts,
    resetFilters
  }
})