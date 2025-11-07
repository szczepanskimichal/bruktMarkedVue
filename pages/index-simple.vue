<template>
  <div>
    <!-- Hero Section -->
    <section style="background: linear-gradient(to right, #2563eb, #9333ea); color: white; padding: 80px 16px; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 24px;">
          🛍️ BruktMarked
        </h1>
        <p style="font-size: 1.25rem; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto;">
          Najlepsze miejsce do kupna i sprzedaży używanych ubrań. 
          Znajdź unikalne rzeczy w świetnych cenach!
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <NuxtLink to="/produkty" style="background: #1d4ed8; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Przeglądaj produkty
          </NuxtLink>
          <NuxtLink to="/rejestracja" style="background: white; color: #2563eb; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 500;">
            Dołącz do nas
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section style="padding: 64px 16px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px; text-align: center;">
          <div>
            <div style="font-size: 2.5rem; font-weight: bold; color: #2563eb; margin-bottom: 8px;">500+</div>
            <div style="color: #6b7280;">Produktów</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: bold; color: #2563eb; margin-bottom: 8px;">100+</div>
            <div style="color: #6b7280;">Użytkowników</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: bold; color: #2563eb; margin-bottom: 8px;">50+</div>
            <div style="color: #6b7280;">Sprzedanych rzeczy</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section style="padding: 64px 16px; background: #f9fafb;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 48px; color: #111827;">
          Popularne kategorie
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">👔</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">Koszule i bluzki</h3>
            <p style="color: #6b7280;">Eleganckie i casualowe</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">👖</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">Spodnie i jeansy</h3>
            <p style="color: #6b7280;">W każdym stylu</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">👗</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">Sukienki</h3>
            <p style="color: #6b7280;">Na każdą okazję</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 16px;">👟</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">Buty</h3>
            <p style="color: #6b7280;">Sportowe i eleganckie</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section style="padding: 64px 16px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 2rem; font-weight: bold; text-align: center; margin-bottom: 48px; color: #111827;">
          Jak to działa?
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px;">
          <div style="text-align: center;">
            <div style="background: #dbeafe; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem;">📱</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">1. Zarejestruj się</h3>
            <p style="color: #6b7280;">Stwórz darmowe konto w kilka sekund</p>
          </div>
          <div style="text-align: center;">
            <div style="background: #dbeafe; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem;">📸</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">2. Dodaj produkt</h3>
            <p style="color: #6b7280;">Zrób zdjęcia i opisz swoje ubrania</p>
          </div>
          <div style="text-align: center;">
            <div style="background: #dbeafe; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 2rem;">💰</div>
            <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 8px;">3. Sprzedaj</h3>
            <p style="color: #6b7280;">Otrzymuj płatności bezpośrednio przez Vipps</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section style="background: #111827; color: white; padding: 64px 16px; text-align: center;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 16px;">
          Gotowy na handel?
        </h2>
        <p style="font-size: 1.125rem; margin-bottom: 32px; color: #d1d5db;">
          Dołącz do tysięcy użytkowników, którzy już kupują i sprzedają na BruktMarked
        </p>
        <NuxtLink to="/rejestracja" style="background: #2563eb; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1.125rem;">
          Rozpocznij już dziś
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Simple homepage without complex dependencies
</script>