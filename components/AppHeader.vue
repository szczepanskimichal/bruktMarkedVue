<template>
  <header class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <SimpleIcon name="mdi:shopping" class="w-8 h-8 text-blue-600" />
          <span class="text-xl font-bold text-gray-900 dark:text-white">
            BruktMarked
          </span>
        </NuxtLink>

        <!-- ...usunięto wyszukiwanie z headera... -->

        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <!-- Products Button -->
          <NuxtLink to="/produkty" class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            <SimpleIcon name="mdi:view-grid" class="w-5 h-5" />
            <span class="hidden sm:block">Wszystkie produkty</span>
          </NuxtLink>

          <!-- Favorites -->
          <NuxtLink 
            to="/ulubione"
            class="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-red-500"
          >
            <SimpleIcon name="mdi:heart" class="w-6 h-6" />
            <span 
              v-if="favoritesCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ favoritesCount }}
            </span>
          </NuxtLink>

          <!-- Messages -->
          <NuxtLink 
            v-if="user"
            to="/wiadomosci"
            class="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            <SimpleIcon name="mdi:message" class="w-6 h-6" />
            <span 
              v-if="unreadMessages > 0"
              class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ unreadMessages }}
            </span>
          </NuxtLink>

          <!-- User Menu or Auth Buttons -->
          <div v-if="user" class="relative" ref="userDropdown">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              <img
                :src="user.avatar || '/api/placeholder/32/32'"
                :alt="user.username"
                class="w-8 h-8 rounded-full"
              >
              <span class="hidden sm:block">{{ user.username }}</span>
              <SimpleIcon name="mdi:chevron-down" class="w-4 h-4" />
            </button>
            
            <div 
              v-if="showUserMenu"
              class="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
            >
              <NuxtLink
                to="/profil"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                <SimpleIcon name="mdi:account" class="w-4 h-4 inline mr-2" />
                Mój profil
              </NuxtLink>
              <NuxtLink
                to="/moje-produkty"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                <SimpleIcon name="mdi:package-variant" class="w-4 h-4 inline mr-2" />
                Moje produkty
              </NuxtLink>
              <NuxtLink
                to="/sprzedaj"
                class="block px-4 py-2 text-sm text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showUserMenu = false"
              >
                <SimpleIcon name="mdi:plus" class="w-4 h-4 inline mr-2" />
                Dodaj produkt
              </NuxtLink>
              <div 
                v-if="user.isAdmin"
                class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
              >
                <NuxtLink
                  to="/admin"
                  class="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  @click="showUserMenu = false"
                >
                  <SimpleIcon name="mdi:shield-account" class="w-4 h-4 inline mr-2" />
                  Panel admin
                </NuxtLink>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <SimpleIcon name="mdi:logout" class="w-4 h-4 inline mr-2" />
                  Wyloguj się
                </button>
              </div>
            </div>
          </div>

          <div v-else class="flex items-center space-x-2">
            <NuxtLink to="/logowanie" class="btn-secondary text-sm">
              Zaloguj się
            </NuxtLink>
            <NuxtLink to="/rejestracja" class="btn-primary text-sm">
              Załóż konto
            </NuxtLink>
          </div>

          <!-- Theme Toggle -->
          <button
            @click="toggleTheme"
            class="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <SimpleIcon 
              :name="isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" 
              class="w-5 h-5"
            />
          </button>

          <!-- Mobile Menu Toggle -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden p-2 text-gray-700 dark:text-gray-300"
          >
            <SimpleIcon name="mdi:menu" class="w-6 h-6" />
          </button>
        </nav>
      </div>

      <!-- ...usunięto wyszukiwanie z headera mobile... -->

      <!-- Mobile Menu -->
      <div 
        v-if="showMobileMenu"
        class="md:hidden border-t border-gray-200 dark:border-gray-700 py-4"
      >
        <nav class="space-y-2">
          <NuxtLink 
            to="/produkty" 
            class="block py-2 text-gray-700 dark:text-gray-300"
            @click="showMobileMenu = false"
          >
            Wszystkie produkty
          </NuxtLink>
          <NuxtLink 
            to="/sprzedaj" 
            class="block py-2 text-green-600"
            @click="showMobileMenu = false"
          >
            Dodaj produkt
          </NuxtLink>
          <NuxtLink 
            to="/ulubione" 
            class="block py-2 text-gray-700 dark:text-gray-300"
            @click="showMobileMenu = false"
          >
            Ulubione
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const { user } = storeToRefs(authStore)
const { count: favoritesCount } = storeToRefs(favoritesStore)

const searchQuery = ref('')
const showCategories = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const unreadMessages = ref(0)

const isDark = ref(false)

const categories = [
  'Koszulki',
  'Spodnie',
  'Sukienki',
  'Buty',
  'Kurtki',
  'Akcesoria',
  'Bielizna',
  'Sportowe'
]

// Close dropdowns when clicking outside
const categoriesDropdown = ref(null)
const userDropdown = ref(null)
onClickOutside(categoriesDropdown, () => {
  showCategories.value = false
})

onClickOutside(userDropdown, () => {
  showUserMenu.value = false
})


let searchTimeout: NodeJS.Timeout | undefined
watch(searchQuery, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (val.trim()) {
    searchTimeout = setTimeout(() => {
      navigateTo(`/produkty?search=${encodeURIComponent(val)}`)
    }, 500)
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Implementation for theme switching
}

const logout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  navigateTo('/')
}

// Add missing fetchUnreadMessages function
const fetchUnreadMessages = async () => {
  if (user.value) {
    // Replace with actual API call to fetch unread messages
    // Example:
    // unreadMessages.value = await api.getUnreadMessagesCount(user.value.id)
    unreadMessages.value = 0 // Placeholder
  } else {
    unreadMessages.value = 0
  }
}

onMounted(() => {
  fetchUnreadMessages()
  const interval = setInterval(fetchUnreadMessages, 30000)
  // Clear interval on unmount
  onUnmounted(() => clearInterval(interval))
})
</script>