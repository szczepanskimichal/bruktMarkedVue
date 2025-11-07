import { defineStore } from 'pinia'
import { ref, computed, readonly } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)

  interface User {
    id: string
    email: string
    username: string
    avatar?: string
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
    city?: string
    isAdmin: boolean
    createdAt: string
  }

  interface LoginCredentials {
    email: string
    password: string
  }

  interface RegisterData {
    email: string
    username: string
    password: string
    firstName?: string
    lastName?: string
  }

  // Initialize auth from localStorage
  const initAuth = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth-token')
      const savedUser = localStorage.getItem('auth-user')
      
      if (savedToken && savedUser) {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      }
    }
  }

  // Login
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    try {
      const data = await $fetch<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      user.value = data.user
      token.value = data.token

      if (process.client) {
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('auth-user', JSON.stringify(data.user))
      }

      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Handle different error structures
      let errorMessage = 'Błąd logowania'
      
      if (error?.statusMessage) {
        errorMessage = error.statusMessage
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  // Register
  const register = async (userData: RegisterData) => {
    isLoading.value = true
    try {
      const data = await $fetch<{ user: User; token: string }>('/api/auth/register', {
        method: 'POST',
        body: userData
      })

      user.value = data.user
      token.value = data.token

      if (process.client) {
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('auth-user', JSON.stringify(data.user))
      }

      return { success: true }
    } catch (error: any) {
      console.error('Register error:', error)
      
      // Handle different error structures
      let errorMessage = 'Błąd rejestracji'
      
      if (error?.statusMessage) {
        errorMessage = error.statusMessage
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      return { 
        success: false, 
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null

    if (process.client) {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
    }
  }

  // Update user profile
  const updateProfile = async (profileData: Partial<User>) => {
    isLoading.value = true
    try {
      const data = await $fetch<{ user: User }>('/api/auth/profile', {
        method: 'PUT',
        body: profileData,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      user.value = data.user

      if (process.client) {
        localStorage.setItem('auth-user', JSON.stringify(data.user))
      }

      return { success: true }
    } catch (error: any) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        error: error.data?.message || 'Błąd aktualizacji profilu' 
      }
    } finally {
      isLoading.value = false
    }
  }

  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Check if user is admin
  const isAdmin = computed(() => user.value?.isAdmin ?? false)

  return {
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    isAuthenticated,
    isAdmin,
    initAuth,
    login,
    register,
    logout,
    updateProfile
  }
})