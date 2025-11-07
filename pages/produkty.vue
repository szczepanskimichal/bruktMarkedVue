<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 32px 16px;">
    <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 24px; color: #111827;">
      Produkty
    </h1>
    
    <!-- Search -->
    <div style="margin-bottom: 32px;">
      <input 
        type="text" 
        placeholder="Szukaj produktów..." 
        style="width: 100%; max-width: 400px; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; outline: none;"
      />
    </div>

    <!-- Sample Products -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px;">
      <div v-for="i in 8" :key="i" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="height: 200px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; color: #6b7280;">
          Zdjęcie produktu
        </div>
        <div style="padding: 16px;">
          <h3 style="font-weight: 600; margin-bottom: 8px;">Produkt {{ i }}</h3>
          <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 12px;">Opis produktu...</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: #2563eb;">{{ i * 50 }} zł</span>
            <button style="background: #2563eb; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 0.875rem; cursor: pointer;">
              Zobacz
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple products page
</script>