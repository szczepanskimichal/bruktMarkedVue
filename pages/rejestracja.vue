<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <SimpleIcon name="mdi:shopping" class="w-12 h-12 text-blue-600" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
        Załóż konto w BruktMarked
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Lub
        <NuxtLink 
          to="/logowanie" 
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          zaloguj się do istniejącego konta
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card px-4 py-8 sm:px-10">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="form-label">
              Nazwa użytkownika
            </label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              autocomplete="username"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.username }"
              placeholder="np. jan_kowalski"
            >
            <p v-if="errors.username" class="mt-1 text-sm text-red-600">
              {{ errors.username }}
            </p>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              3-30 znaków, tylko litery, cyfry i podkreślenia
            </p>
          </div>

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

          <!-- First Name -->
          <div>
            <label for="firstName" class="form-label">
              Imię (opcjonalne)
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              class="form-input"
              :class="{ 'border-red-500': errors.firstName }"
            >
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="form-label">
              Nazwisko (opcjonalne)
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              class="form-input"
              :class="{ 'border-red-500': errors.lastName }"
            >
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
              {{ errors.lastName }}
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
                autocomplete="new-password"
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
            
            <!-- Password strength indicator -->
            <div class="mt-2">
              <div class="flex space-x-1">
                <div 
                  v-for="i in 4" 
                  :key="i"
                  class="h-1 w-1/4 rounded"
                  :class="passwordStrength >= i ? getStrengthColor(passwordStrength) : 'bg-gray-200'"
                />
              </div>
              <p class="mt-1 text-xs" :class="getStrengthTextColor(passwordStrength)">
                {{ getStrengthText(passwordStrength) }}
              </p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="form-label">
              Potwierdź hasło
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                required
                class="form-input pr-10"
                :class="{ 'border-red-500': errors.confirmPassword }"
              >
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <SimpleIcon 
                  :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
                  class="w-5 h-5 text-gray-400"
                />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Terms acceptance -->
          <div class="flex items-center">
            <input
              id="acceptTerms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :class="{ 'border-red-500': errors.acceptTerms }"
            >
            <label for="acceptTerms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Akceptuję 
              <NuxtLink to="/regulamin" class="text-blue-600 hover:text-blue-500">regulamin</NuxtLink>
              i 
              <NuxtLink to="/prywatnosc" class="text-blue-600 hover:text-blue-500">politykę prywatności</NuxtLink>
            </label>
          </div>
          <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-600">
            {{ errors.acceptTerms }}
          </p>

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
              {{ isLoading ? 'Tworzenie konta...' : 'Załóż konto' }}
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
  title: 'Rejestracja - BruktMarked',
  meta: [
    { name: 'description', content: 'Załóż darmowe konto w BruktMarked' }
  ]
})

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password
  let strength = 0
  
  if (password.length >= 6) strength++
  if (password.length >= 10) strength++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++
  
  return strength
})

const getStrengthColor = (strength: number) => {
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
  return colors[strength - 1] || 'bg-gray-200'
}

const getStrengthTextColor = (strength: number) => {
  const colors = ['text-red-600', 'text-orange-600', 'text-yellow-600', 'text-green-600']
  return colors[strength - 1] || 'text-gray-500'
}

const getStrengthText = (strength: number) => {
  const texts = ['Słabe', 'Średnie', 'Dobre', 'Bardzo dobre']
  return texts[strength - 1] || 'Wprowadź hasło'
}

// Clear errors when user types
watch(() => form.username, () => {
  errors.username = ''
  errorMessage.value = ''
})

watch(() => form.email, () => {
  errors.email = ''
  errorMessage.value = ''
})

watch(() => form.password, () => {
  errors.password = ''
  errors.confirmPassword = ''
  errorMessage.value = ''
})

watch(() => form.confirmPassword, () => {
  errors.confirmPassword = ''
  errorMessage.value = ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Validate username
  if (!form.username) {
    errors.username = 'Nazwa użytkownika jest wymagana'
    isValid = false
  } else if (form.username.length < 3 || form.username.length > 30) {
    errors.username = 'Nazwa użytkownika musi mieć 3-30 znaków'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Nazwa może zawierać tylko litery, cyfry i podkreślenia'
    isValid = false
  }
  
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
  
  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Potwierdzenie hasła jest wymagane'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Hasła nie są identyczne'
    isValid = false
  }
  
  // Validate terms acceptance
  if (!form.acceptTerms) {
    errors.acceptTerms = 'Musisz zaakceptować regulamin'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.register({
      username: form.username,
      email: form.email,
      password: form.password,
      firstName: form.firstName || undefined,
      lastName: form.lastName || undefined
    })
    
    if (result.success) {
      notificationStore.success('Konto utworzone pomyślnie', 'Witaj w BruktMarked!')
      await navigateTo('/')
    } else {
      errorMessage.value = result.error || 'Błąd tworzenia konta'
    }
  } catch (error) {
    console.error('Register error:', error)
    errorMessage.value = 'Wystąpił błąd podczas tworzenia konta'
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