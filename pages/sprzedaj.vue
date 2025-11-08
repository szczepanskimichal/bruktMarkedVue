<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Page Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Dodaj nowy produkt
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Sprzedaj swoje nieużywane ubrania szybko i bezpiecznie
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Product Images -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Zdjęcia produktu
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
            <!-- Upload zones -->
            <div
              v-for="n in 6"
              :key="n"
              class="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              :class="{ 'border-blue-500 dark:border-blue-400': form.images.length >= n }"
              @click="uploadImage(n)"
            >
              <div v-if="form.images[n - 1]" class="relative w-full h-full">
                <img
                  :src="form.images[n - 1]"
                  alt="Product"
                  class="w-full h-full object-cover rounded-lg"
                >
                <button
                  type="button"
                  @click.stop="removeImage(n - 1)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
              <div v-else class="text-center p-4">
                <SimpleIcon name="mdi:camera" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ n === 1 ? 'Główne zdjęcie' : `Zdjęcie ${n}` }}
                </span>
              </div>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Dodaj do 6 zdjęć. Pierwsze zdjęcie będzie głównym. Upload funkcjonalność będzie dodana wkrótce.
          </p>
          <p v-if="errors.images" class="text-sm text-red-600 mt-2">
            {{ errors.images }}
          </p>
        </div>

        <!-- Product Details -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Szczegóły produktu
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2">
              <label for="title" class="form-label">
                Tytuł produktu *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                required
                maxlength="100"
                class="form-input"
                :class="{ 'border-red-500': errors.title }"
                placeholder="np. Sukienka H&M rozmiar M"
              >
              <p class="text-sm text-gray-500 mt-1">
                {{ form.title.length }}/100 znaków
              </p>
              <p v-if="errors.title" class="text-sm text-red-600 mt-1">
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
                class="form-select"
                :class="{ 'border-red-500': errors.category }"
              >
                <option value="">Wybierz kategorię</option>
                <option value="koszulki">Koszulki i bluzki</option>
                <option value="spodnie">Spodnie i jeansy</option>
                <option value="sukienki">Sukienki</option>
                <option value="buty">Buty</option>
                <option value="kurtki">Kurtki i płaszcze</option>
                <option value="swetry">Swetry i kardigany</option>
                <option value="spodnice">Spódnice</option>
                <option value="akcesoria">Akcesoria</option>
                <option value="bielizna">Bielizna</option>
                <option value="sportowe">Odzież sportowa</option>
                <option value="inne">Inne</option>
              </select>
              <p v-if="errors.category" class="text-sm text-red-600 mt-1">
                {{ errors.category }}
              </p>
            </div>

            <!-- Price -->
            <div>
              <label for="price" class="form-label">
                Cena (kr) *
              </label>
              <div class="relative">
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  min="1"
                  step="1"
                  required
                  class="form-input pr-10"
                  :class="{ 'border-red-500': errors.price }"
                  placeholder="100"
                >
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">kr</span>
              </div>
              <p v-if="errors.price" class="text-sm text-red-600 mt-1">
                {{ errors.price }}
              </p>
            </div>

            <!-- Size -->
            <div>
              <label for="size" class="form-label">
                Rozmiar
              </label>
              <select
                id="size"
                v-model="form.size"
                class="form-select"
              >
                <option value="">Wybierz rozmiar</option>
                <optgroup label="Rozmiary literowe">
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </optgroup>
                <optgroup label="Rozmiary numeryczne">
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                  <option value="42">42</option>
                  <option value="44">44</option>
                  <option value="46">46</option>
                  <option value="48">48</option>
                </optgroup>
                <optgroup label="Buty">
                  <option value="35">35</option>
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
                </optgroup>
              </select>
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
                class="form-select"
                :class="{ 'border-red-500': errors.condition }"
              >
                <option value="">Wybierz stan</option>
                <option value="nowy">Nowy z metkami</option>
                <option value="bardzo dobry">Bardzo dobry</option>
                <option value="dobry">Dobry</option>
                <option value="zadowalający">Zadowalający</option>
              </select>
              <p v-if="errors.condition" class="text-sm text-red-600 mt-1">
                {{ errors.condition }}
              </p>
            </div>

            <!-- Brand -->
            <div>
              <label for="brand" class="form-label">
                Marka
              </label>
              <input
                id="brand"
                v-model="form.brand"
                type="text"
                maxlength="50"
                class="form-input"
                placeholder="np. H&M, Zara, Nike"
              >
              <p class="text-sm text-gray-500 mt-1">
                {{ (form.brand?.length || 0) }}/50 znaków
              </p>
            </div>

            <!-- Color -->
            <div>
              <label for="color" class="form-label">
                Kolor
              </label>
              <select
                id="color"
                v-model="form.color"
                class="form-select"
              >
                <option value="">Wybierz kolor</option>
                <option value="czarny">Czarny</option>
                <option value="biały">Biały</option>
                <option value="szary">Szary</option>
                <option value="niebieski">Niebieski</option>
                <option value="czerwony">Czerwony</option>
                <option value="zielony">Zielony</option>
                <option value="żółty">Żółty</option>
                <option value="różowy">Różowy</option>
                <option value="brązowy">Brązowy</option>
                <option value="beżowy">Beżowy</option>
                <option value="fioletowy">Fioletowy</option>
                <option value="pomarańczowy">Pomarańczowy</option>
                <option value="wielokolorowy">Wielokolorowy</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Opis produktu
          </h2>
          <label for="description" class="form-label">
            Opis *
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="6"
            required
            maxlength="1000"
            class="form-input"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Opisz dokładnie stan produktu, materiał, wymiary, historię noszenia itp. Szczegółowy opis pomoże sprzedać produkt szybciej."
          ></textarea>
          <div class="flex justify-between items-center mt-2">
            <p v-if="errors.description" class="text-sm text-red-600">
              {{ errors.description }}
            </p>
            <p class="text-sm text-gray-500">
              {{ form.description.length }}/1000 znaków
            </p>
          </div>
        </div>

        <!-- Selling Tips -->
        <div class="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 Wskazówki sprzedawcy
          </h3>
          <ul class="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li class="flex items-start">
              <span class="font-medium mr-2">📸</span>
              Dodaj dobre zdjęcia z różnych kątów - pierwszego wrażenia nie da się poprawić
            </li>
            <li class="flex items-start">
              <span class="font-medium mr-2">📏</span>
              Podaj dokładne wymiary i stan produktu - unikniesz reklamacji
            </li>
            <li class="flex items-start">
              <span class="font-medium mr-2">💰</span>
              Sprawdź ceny podobnych produktów na stronie przed ustaleniem swojej
            </li>
            <li class="flex items-start">
              <span class="font-medium mr-2">⚡</span>
              Szybko odpowiadaj na wiadomości od potencjalnych kupujących
            </li>
          </ul>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
          <NuxtLink to="/produkty" class="btn-secondary">
            Anuluj
          </NuxtLink>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="btn-primary"
          >
            <SimpleIcon 
              v-if="isLoading" 
              name="mdi:loading" 
              class="w-5 h-5 mr-2 animate-spin" 
            />
            {{ isLoading ? 'Dodawanie...' : 'Opublikuj produkt' }}
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
import { computed, ref, watch } from 'vue'
import { useProductsStore } from '~/stores/products'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'

// Meta tags
useHead({
  title: 'Dodaj produkt - BruktMarked',
  meta: [
    { name: 'description', content: 'Sprzedaj swoje nieużywane ubrania na BruktMarked' }
  ]
})

// Stores
const productsStore = useProductsStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Redirect if not logged in
if (!authStore.isAuthenticated) {
  throw createError({
    statusCode: 401,
    statusMessage: 'Musisz być zalogowany, aby dodać produkt'
  })
}

// Form data
const form = reactive({
  title: '',
  description: '',
  price: null as number | null,
  category: '',
  size: '',
  condition: '',
  brand: '',
  color: '',
  images: [] as string[]
})

// Form validation
const errors = reactive({
  title: '',
  description: '',
  price: '',
  category: '',
  condition: '',
  images: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

// Computed validation
const isFormValid = computed(() => {
  return form.title.trim() &&
         form.description.trim() &&
         form.price &&
         form.price > 0 &&
         form.category &&
         form.condition &&
         !Object.values(errors).some(error => error !== '')
})

// Clear errors when user types
watch(() => form.title, () => { errors.title = '' })
watch(() => form.description, () => { errors.description = '' })
watch(() => form.price, () => { errors.price = '' })
watch(() => form.category, () => { errors.category = '' })
watch(() => form.condition, () => { errors.condition = '' })

// Validate form
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  // Title validation
  if (!form.title.trim()) {
    errors.title = 'Tytuł jest wymagany'
    isValid = false
  } else if (form.title.length > 100) {
    errors.title = 'Tytuł może mieć maksymalnie 100 znaków'
    isValid = false
  }

  // Description validation
  if (!form.description.trim()) {
    errors.description = 'Opis jest wymagany'
    isValid = false
  } else if (form.description.length > 1000) {
    errors.description = 'Opis może mieć maksymalnie 1000 znaków'
    isValid = false
  }

  // Price validation
  if (!form.price) {
    errors.price = 'Cena jest wymagana'
    isValid = false
  } else if (form.price <= 0) {
    errors.price = 'Cena musi być większa niż 0'
    isValid = false
  } else if (form.price > 100000) {
    errors.price = 'Cena jest zbyt wysoka'
    isValid = false
  }

  // Category validation
  if (!form.category) {
    errors.category = 'Kategoria jest wymagana'
    isValid = false
  }

  // Condition validation
  if (!form.condition) {
    errors.condition = 'Stan produktu jest wymagany'
    isValid = false
  }

  // Images validation (optional but recommended)
  if (form.images.length === 0) {
    errors.images = 'Zalecane jest dodanie co najmniej jednego zdjęcia'
  }

  return isValid
}

// Image handling (placeholder)
const uploadImage = (index: number) => {
  // Placeholder for image upload functionality
  const placeholderUrls = [
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400',
    '/api/placeholder/400/400'
  ]
  
  if (form.images.length < index) {
    const url = placeholderUrls[index - 1]
    if (url) {
      form.images.push(url)
    }
  }
  
  notificationStore.info('Info', 'Upload zdjęć zostanie dodany w przyszłej aktualizacji')
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await productsStore.createProduct({
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price!,
      category: form.category,
      size: form.size || undefined,
      condition: form.condition,
      brand: form.brand?.trim() || undefined,
      color: form.color || undefined,
      images: form.images
    }, authStore.token || '')

    if (result.success) {
      notificationStore.success(
        'Produkt dodany!', 
        'Twój produkt został pomyślnie dodany i jest teraz widoczny dla kupujących'
      )
      
      // Redirect to product page or products list
      if (result.product) {
        navigateTo(`/produkt/${result.product.id}`)
      } else {
        navigateTo('/produkty')
      }
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
</script>