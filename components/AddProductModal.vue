<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Dodaj nowy produkt
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <SimpleIcon name="mdi:close" class="w-6 h-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="form-label">
            Tytuł produktu *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="form-input"
            :class="{ 'border-red-500': errors.title }"
            placeholder="np. Nike Air Max 90 - rozmiar 42"
          >
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="form-label">
            Kategoria *
          </label>
          <select
            id="category"
            v-model="form.category"
            required
            class="form-input"
            :class="{ 'border-red-500': errors.category }"
          >
            <option value="">Wybierz kategorię</option>
            <option value="koszulki">Koszulki</option>
            <option value="spodnie">Spodnie</option>
            <option value="sukienki">Sukienki</option>
            <option value="buty">Buty</option>
            <option value="kurtki">Kurtki</option>
            <option value="swetry">Swetry</option>
            <option value="spódnice">Spódnice</option>
            <option value="akcesoria">Akcesoria</option>
            <option value="inne">Inne</option>
          </select>
          <p v-if="errors.category" class="mt-1 text-sm text-red-600">
            {{ errors.category }}
          </p>
        </div>

        <!-- Price and Size -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="price" class="form-label">
              Cena (zł) *
            </label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="1"
              step="0.01"
              required
              class="form-input"
              :class="{ 'border-red-500': errors.price }"
              placeholder="0.00"
            >
            <p v-if="errors.price" class="mt-1 text-sm text-red-600">
              {{ errors.price }}
            </p>
          </div>

          <div>
            <label for="size" class="form-label">
              Rozmiar
            </label>
            <select
              id="size"
              v-model="form.size"
              class="form-input"
            >
              <option value="">Wybierz rozmiar</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="36">36</option>
              <option value="37">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>

        <!-- Condition -->
        <div>
          <label for="condition" class="form-label">
            Stan produktu *
          </label>
          <select
            id="condition"
            v-model="form.condition"
            required
            class="form-input"
            :class="{ 'border-red-500': errors.condition }"
          >
            <option value="">Wybierz stan</option>
            <option value="nowy">Nowy z metkami</option>
            <option value="bardzo_dobry">Bardzo dobry</option>
            <option value="dobry">Dobry</option>
            <option value="przeciętny">Przeciętny</option>
            <option value="słaby">Słaby</option>
          </select>
          <p v-if="errors.condition" class="mt-1 text-sm text-red-600">
            {{ errors.condition }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="form-label">
            Opis produktu *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            required
            rows="4"
            class="form-input resize-none"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Opisz szczegółowo produkt, jego stan, materiał, etc..."
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">
            {{ errors.description }}
          </p>
          <p class="mt-1 text-sm text-gray-500">
            {{ form.description.length }}/2000 znaków
          </p>
        </div>

        <!-- Images Upload Placeholder -->
        <div>
          <label class="form-label">
            Zdjęcia produktu
          </label>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <SimpleIcon name="mdi:image" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400">
              Upload zdjęć zostanie dodany wkrótce
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-secondary"
          >
            Anuluj
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="btn-primary"
          >
            <SimpleIcon 
              v-if="isLoading" 
              name="mdi:loading" 
              class="w-4 h-4 mr-2 animate-spin" 
            />
            {{ isLoading ? 'Dodawanie...' : 'Dodaj produkt' }}
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
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

defineEmits<Emits>()

const productsStore = useProductsStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const form = reactive({
  title: '',
  description: '',
  price: 0,
  category: '',
  size: '',
  condition: ''
})

const errors = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  condition: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// Clear errors when user types
watch(() => form.title, () => { errors.title = ''; errorMessage.value = '' })
watch(() => form.description, () => { errors.description = ''; errorMessage.value = '' })
watch(() => form.price, () => { errors.price = ''; errorMessage.value = '' })
watch(() => form.category, () => { errors.category = ''; errorMessage.value = '' })
watch(() => form.condition, () => { errors.condition = ''; errorMessage.value = '' })

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  if (!form.title.trim()) {
    errors.title = 'Tytuł jest wymagany'
    isValid = false
  } else if (form.title.length > 200) {
    errors.title = 'Tytuł może mieć maksymalnie 200 znaków'
    isValid = false
  }
  
  if (!form.description.trim()) {
    errors.description = 'Opis jest wymagany'
    isValid = false
  } else if (form.description.length > 2000) {
    errors.description = 'Opis może mieć maksymalnie 2000 znaków'
    isValid = false
  }
  
  if (!form.price || form.price <= 0) {
    errors.price = 'Cena musi być większa od 0'
    isValid = false
  }
  
  if (!form.category) {
    errors.category = 'Kategoria jest wymagana'
    isValid = false
  }
  
  if (!form.condition) {
    errors.condition = 'Stan produktu jest wymagany'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  if (!authStore.token) {
    errorMessage.value = 'Musisz być zalogowany'
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const result = await productsStore.createProduct({
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price,
      category: form.category,
      size: form.size || undefined,
      condition: form.condition
    }, authStore.token)
    
    if (result.success) {
      notificationStore.success('Produkt dodany pomyślnie', 'Twój produkt jest teraz dostępny dla kupujących!')
      emit('success')
      emit('close')
    } else {
      errorMessage.value = result.error || 'Błąd dodawania produktu'
    }
  } catch (error) {
    console.error('Add product error:', error)
    errorMessage.value = 'Wystąpił błąd podczas dodawania produktu'
  } finally {
    isLoading.value = false
  }
}

const emit = defineEmits<Emits>()
</script>