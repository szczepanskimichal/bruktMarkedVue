<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <SimpleIcon name="mdi:shopping" class="w-12 h-12 text-blue-600" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Zaloguj się do BruktMarked
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Lub
        <NuxtLink 
          to="/rejestracja" 
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          załóż nowe konto
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card px-4 py-8 sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="form-label">
              Adres email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.email }"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="form-label">
              Hasło
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="form-input pr-10"
                :class="{ 'border-red-500': errors.password }"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <SimpleIcon 
                  :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="w-5 h-5 text-gray-400"
                />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Zapamiętaj mnie
              </label>
            </div>

            <div class="text-sm">
              <NuxtLink 
                to="/resetuj-haslo" 
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Zapomniałeś hasła?
              </NuxtLink>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full btn-primary flex justify-center items-center"
            >
              <SimpleIcon 
                v-if="isLoading" 
                name="mdi:loading" 
                class="w-5 h-5 mr-2 animate-spin"
              />
              {{ isLoading ? 'Logowanie...' : 'Zaloguj się' }}
            </button>
          </div>

          <!-- Error message -->
          <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-md p-4">
            <div class="flex">
              <SimpleIcon name="mdi:alert-circle" class="w-5 h-5 text-red-400" />
              <div class="ml-3">
                <p class="text-sm text-red-800 dark:text-red-200">
                  {{ errorMessage }}
                </p>
              </div>
            </div>
          </div>
        </form>

        <!-- Social login (placeholder) -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Lub kontynuuj z</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <SimpleIcon name="mdi:google" class="w-5 h-5" />
            </button>

            <button
              type="button"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <SimpleIcon name="mdi:facebook" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

// Użyj specjalnego layoutu dla autentykacji
definePageMeta({
  layout: 'auth'
})

// Meta tags
useHead({
  title: 'Logowanie - BruktMarked',
  meta: [
    { name: 'description', content: 'Zaloguj się do swojego konta BruktMarked' }
  ]
})

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

// Clear errors when user types
watch(() => form.email, () => {
  errors.email = ''
  errorMessage.value = ''
})

watch(() => form.password, () => {
  errors.password = ''
  errorMessage.value = ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.email = ''
  errors.password = ''
  
  // Validate email
  if (!form.email) {
    errors.email = 'Email jest wymagany'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Nieprawidłowy format email'
    isValid = false
  }
  
  // Validate password
  if (!form.password) {
    errors.password = 'Hasło jest wymagane'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Hasło musi mieć co najmniej 6 znaków'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result.success) {
      notificationStore.success('Zalogowano pomyślnie', 'Witaj ponownie!')
      await navigateTo('/')
    } else {
      errorMessage.value = result.error || 'Błąd logowania'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Wystąpił błąd podczas logowania'
  } finally {
    isLoading.value = false
  }
}

// Redirect if already logged in
onMounted(() => {
  if (authStore.isAuthenticated) {
    navigateTo('/')
  }
})
</script>