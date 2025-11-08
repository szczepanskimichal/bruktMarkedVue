<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Mój profil
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Zarządzaj swoimi danymi osobowymi i ustawieniami konta
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Avatar -->
        <div class="lg:col-span-1">
          <div class="card p-6 text-center">
            <div class="relative inline-block mb-4">
              <img
                :src="form.avatar || '/api/placeholder/128/128'"
                alt="Avatar"
                class="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200 dark:border-gray-600"
              >
              <button
                type="button"
                @click="uploadAvatar"
                class="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <SimpleIcon name="mdi:camera" class="w-5 h-5" />
              </button>
            </div>
            
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ form.username }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Członek od {{ formatJoinDate(user?.createdAt) }}
            </p>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 text-center">
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {{ userStats.productsCount }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Produktów
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ userStats.soldCount }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Sprzedanych
                </div>
              </div>
            </div>
            
            <!-- Admin Badge -->
            <div v-if="user?.isAdmin" class="mt-4">
              <span class="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full">
                <SimpleIcon name="mdi:shield-account" class="w-4 h-4 inline mr-1" />
                Administrator
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Personal Information -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Informacje osobiste
            </h3>
            
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Username -->
                <div>
                  <label for="username" class="form-label">
                    Nazwa użytkownika *
                  </label>
                  <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    required
                    maxlength="30"
                    class="form-input"
                    :class="{ 'border-red-500': errors.username }"
                  >
                  <p v-if="errors.username" class="text-sm text-red-600 mt-1">
                    {{ errors.username }}
                  </p>
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="form-label">
                    Adres email *
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="form-input"
                    :class="{ 'border-red-500': errors.email }"
                  >
                  <p v-if="errors.email" class="text-sm text-red-600 mt-1">
                    {{ errors.email }}
                  </p>
                </div>

                <!-- First Name -->
                <div>
                  <label for="firstName" class="form-label">
                    Imię
                  </label>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    maxlength="50"
                    class="form-input"
                  >
                </div>

                <!-- Last Name -->
                <div>
                  <label for="lastName" class="form-label">
                    Nazwisko
                  </label>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    maxlength="50"
                    class="form-input"
                  >
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="form-label">
                    Numer telefonu
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-input"
                    placeholder="+47 123 456 789"
                  >
                </div>

                <!-- City -->
                <div>
                  <label for="city" class="form-label">
                    Miasto
                  </label>
                  <input
                    id="city"
                    v-model="form.city"
                    type="text"
                    maxlength="100"
                    class="form-input"
                    placeholder="Oslo"
                  >
                </div>
              </div>

              <!-- Address -->
              <div>
                <label for="address" class="form-label">
                  Adres
                </label>
                <textarea
                  id="address"
                  v-model="form.address"
                  rows="3"
                  maxlength="200"
                  class="form-input"
                  placeholder="Adres do dostawy (opcjonalny)"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isUpdating"
                  class="btn-primary"
                >
                  <SimpleIcon 
                    v-if="isUpdating" 
                    name="mdi:loading" 
                    class="w-5 h-5 mr-2 animate-spin" 
                  />
                  {{ isUpdating ? 'Zapisywanie...' : 'Zapisz zmiany' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Zmiana hasła
            </h3>
            
            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label for="currentPassword" class="form-label">
                  Obecne hasło *
                </label>
                <div class="relative">
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    required
                    class="form-input pr-10"
                    :class="{ 'border-red-500': passwordErrors.currentPassword }"
                  >
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <SimpleIcon 
                      :name="showCurrentPassword ? 'mdi:eye-off' : 'mdi:eye'"
                      class="w-5 h-5 text-gray-400"
                    />
                  </button>
                </div>
                <p v-if="passwordErrors.currentPassword" class="text-sm text-red-600 mt-1">
                  {{ passwordErrors.currentPassword }}
                </p>
              </div>

              <div>
                <label for="newPassword" class="form-label">
                  Nowe hasło *
                </label>
                <div class="relative">
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    minlength="6"
                    class="form-input pr-10"
                    :class="{ 'border-red-500': passwordErrors.newPassword }"
                  >
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <SimpleIcon 
                      :name="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'"
                      class="w-5 h-5 text-gray-400"
                    />
                  </button>
                </div>
                <p v-if="passwordErrors.newPassword" class="text-sm text-red-600 mt-1">
                  {{ passwordErrors.newPassword }}
                </p>
              </div>

              <div>
                <label for="confirmPassword" class="form-label">
                  Potwierdź nowe hasło *
                </label>
                <div class="relative">
                  <input
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="form-input pr-10"
                    :class="{ 'border-red-500': passwordErrors.confirmPassword }"
                  >
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <SimpleIcon 
                      :name="showConfirmPassword ? 'mdi:eye-off' : 'mdi:eye'"
                      class="w-5 h-5 text-gray-400"
                    />
                  </button>
                </div>
                <p v-if="passwordErrors.confirmPassword" class="text-sm text-red-600 mt-1">
                  {{ passwordErrors.confirmPassword }}
                </p>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="isChangingPassword"
                  class="btn-secondary"
                >
                  <SimpleIcon 
                    v-if="isChangingPassword" 
                    name="mdi:loading" 
                    class="w-5 h-5 mr-2 animate-spin" 
                  />
                  {{ isChangingPassword ? 'Zmienianie...' : 'Zmień hasło' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Account Actions -->
          <div class="card p-6 border-red-200 dark:border-red-800">
            <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
              Zarządzanie kontem
            </h3>
            
            <div class="space-y-4">
              <!-- Delete Account -->
              <div class="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <h4 class="font-medium text-red-900 dark:text-red-100">
                    Usuń konto
                  </h4>
                  <p class="text-sm text-red-700 dark:text-red-300">
                    Ta akcja jest nieodwracalna. Wszystkie dane zostaną utracone.
                  </p>
                </div>
                <button
                  @click="showDeleteConfirm = true"
                  class="btn-danger"
                >
                  Usuń konto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">
          Potwierdź usunięcie konta
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Czy na pewno chcesz usunąć swoje konto? Ta akcja jest nieodwracalna i spowoduje:
        </p>
        <ul class="text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-1">
          <li>• Usunięcie wszystkich Twoich produktów</li>
          <li>• Usunięcie historii wiadomości</li>
          <li>• Utratę wszystkich danych profilu</li>
        </ul>
        
        <div class="mb-4">
          <label for="deleteConfirmation" class="form-label text-red-900 dark:text-red-100">
            Wpisz "USUŃ" aby potwierdzić
          </label>
          <input
            id="deleteConfirmation"
            v-model="deleteConfirmation"
            type="text"
            class="form-input"
            placeholder="USUŃ"
          >
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="btn-secondary"
          >
            Anuluj
          </button>
          <button
            @click="deleteAccount"
            :disabled="deleteConfirmation !== 'USUŃ' || isDeleting"
            class="btn-danger"
          >
            <SimpleIcon 
              v-if="isDeleting" 
              name="mdi:loading" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            {{ isDeleting ? 'Usuwanie...' : 'Usuń konto' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

// Meta tags
useHead({
  title: 'Mój profil - BruktMarked',
  meta: [
    { name: 'description', content: 'Zarządzaj swoim profilem na BruktMarked' }
  ]
})

// Stores
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const { user } = storeToRefs(authStore)

// Redirect if not logged in
if (!authStore.isAuthenticated) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Musisz być zalogowany, aby zobaczyć profil'
  })
}

// Form data
const form = reactive({
  username: user.value?.username || '',
  email: user.value?.email || '',
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  phone: user.value?.phone || '',
  address: user.value?.address || '',
  city: user.value?.city || '',
  avatar: user.value?.avatar || ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Validation errors
const errors = reactive({
  username: '',
  email: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// State
const isUpdating = ref(false)
const isChangingPassword = ref(false)
const isDeleting = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmation = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const userStats = ref({
  productsCount: 0,
  soldCount: 0
})

// Load user stats
const loadUserStats = async () => {
  try {
    const stats = await $fetch<{productsCount: number, soldCount: number}>('/api/users/stats', {
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {}
    })
    userStats.value = stats
  } catch (error) {
    console.error('Failed to load user stats:', error)
  }
}

// Update profile
const updateProfile = async () => {
  // Validate form
  errors.username = ''
  errors.email = ''

  if (!form.username.trim()) {
    errors.username = 'Nazwa użytkownika jest wymagana'
    return
  }

  if (!form.email.trim()) {
    errors.email = 'Email jest wymagany'
    return
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Nieprawidłowy format email'
    return
  }

  isUpdating.value = true
  try {
    const result = await authStore.updateProfile({
      username: form.username.trim(),
      email: form.email.trim(),
      firstName: form.firstName?.trim() || undefined,
      lastName: form.lastName?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
      address: form.address?.trim() || undefined,
      city: form.city?.trim() || undefined
    })

    if (result.success) {
      notificationStore.success('Sukces', 'Profil został zaktualizowany')
    } else {
      notificationStore.error('Błąd', result.error || 'Nie udało się zaktualizować profilu')
    }
  } catch (error) {
    console.error('Profile update error:', error)
    notificationStore.error('Błąd', 'Wystąpił błąd podczas aktualizacji profilu')
  } finally {
    isUpdating.value = false
  }
}

// Change password
const changePassword = async () => {
  // Reset errors
  Object.keys(passwordErrors).forEach(key => {
    passwordErrors[key as keyof typeof passwordErrors] = ''
  })

  // Validate
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Obecne hasło jest wymagane'
    return
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'Nowe hasło jest wymagane'
    return
  }

  if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = 'Nowe hasło musi mieć co najmniej 6 znaków'
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Hasła nie pasują do siebie'
    return
  }

  isChangingPassword.value = true
  try {
    await $fetch('/api/auth/change-password', {
      method: 'POST',
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {},
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }
    })

    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''

    notificationStore.success('Sukces', 'Hasło zostało zmienione')
  } catch (error: any) {
    console.error('Change password error:', error)
    
    if (error.statusCode === 400) {
      passwordErrors.currentPassword = 'Nieprawidłowe obecne hasło'
    } else {
      notificationStore.error('Błąd', 'Nie udało się zmienić hasła')
    }
  } finally {
    isChangingPassword.value = false
  }
}

// Upload avatar (placeholder)
const uploadAvatar = () => {
  notificationStore.info('Info', 'Upload avatara zostanie dodany w przyszłej aktualizacji')
}

// Delete account
const deleteAccount = async () => {
  isDeleting.value = true
  try {
    await $fetch('/api/auth/delete-account', {
      method: 'DELETE',
      headers: authStore.token ? {
        Authorization: `Bearer ${authStore.token}`
      } : {}
    })

    notificationStore.success('Konto usunięte', 'Twoje konto zostało trwale usunięte')
    authStore.logout()
    navigateTo('/')
  } catch (error) {
    console.error('Delete account error:', error)
    notificationStore.error('Błąd', 'Nie udało się usunąć konta')
  } finally {
    isDeleting.value = false
  }
}

// Format join date
const formatJoinDate = (dateString?: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long'
  })
}

// Load data on mount
onMounted(() => {
  loadUserStats()
})
</script>