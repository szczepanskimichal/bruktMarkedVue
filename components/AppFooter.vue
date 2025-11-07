<template>
  <footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2 mb-4">
            <SimpleIcon name="mdi:shopping" class="w-8 h-8 text-blue-400" />
            <span class="text-xl font-bold">BruktMarked</span>
          </div>
          <p class="text-gray-400 mb-4 max-w-md">
            Platforma do kupna i sprzedaży używanych ubrań. Znajdź unikalne rzeczy 
            w świetnych cenach lub sprzedaj to, czego już nie nosisz.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <SimpleIcon name="mdi:facebook" class="w-6 h-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <SimpleIcon name="mdi:instagram" class="w-6 h-6" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <SimpleIcon name="mdi:twitter" class="w-6 h-6" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Szybkie linki</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/produkty" class="text-gray-400 hover:text-white transition-colors">
                Wszystkie produkty
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/sprzedaj" class="text-gray-400 hover:text-white transition-colors">
                Sprzedaj produkt
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/jak-to-dziala" class="text-gray-400 hover:text-white transition-colors">
                Jak to działa
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/bezpieczenstwo" class="text-gray-400 hover:text-white transition-colors">
                Bezpieczeństwo
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Pomoc</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/faq" class="text-gray-400 hover:text-white transition-colors">
                FAQ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/kontakt" class="text-gray-400 hover:text-white transition-colors">
                Kontakt
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/regulamin" class="text-gray-400 hover:text-white transition-colors">
                Regulamin
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/prywatnosc" class="text-gray-400 hover:text-white transition-colors">
                Polityka prywatności
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm">
          © {{ currentYear }} BruktMarked. Wszystkie prawa zastrzeżone.
        </p>
        <div class="flex items-center space-x-4 mt-4 md:mt-0">
          <span class="text-gray-400 text-sm">Płatności obsługiwane przez:</span>
          <div class="flex items-center space-x-2">
            <SimpleIcon name="simple-icons:vipps" class="w-8 h-8 text-orange-500" />
            <span class="text-sm text-gray-400">Vipps</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>