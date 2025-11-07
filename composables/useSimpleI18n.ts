import { ref, computed } from 'vue'

const currentLocale = ref('no') // Default to Norwegian

const translations = {
  no: {
    app: {
      name: 'BruktMarked',
      tagline: 'Det beste stedet å kjøpe og selge brukte klær'
    },
    nav: {
      products: 'Produkter',
      login: 'Logg inn',
      register: 'Bli med',
      profile: 'Profil'
    },
    home: {
      title: '🛍️ BruktMarked',
      subtitle: 'Det beste stedet å kjøpe og selge brukte klær. Finn unike ting til gode priser!',
      browseProducts: 'Se produkter',
      joinUs: 'Bli med oss',
      stats: {
        products: 'Produkter',
        users: 'Brukere', 
        sold: 'Solgte varer'
      },
      categories: {
        title: 'Populære kategorier',
        shirts: 'Skjorter og Bluser',
        shirtsDesc: 'Elegante og casual',
        pants: 'Bukser og Jeans', 
        pantsDesc: 'I alle stiler',
        dresses: 'Kjoler',
        dressesDesc: 'For enhver anledning',
        shoes: 'Sko',
        shoesDesc: 'Sport og elegante'
      },
      howItWorks: {
        title: 'Hvordan fungerer det?',
        step1: '1. Registrer deg',
        step1Desc: 'Opprett en gratis konto på sekunder',
        step2: '2. Legg til produkt',
        step2Desc: 'Ta bilder og beskriv klærne dine',
        step3: '3. Selg',
        step3Desc: 'Motta betaling direkte gjennom Vipps'
      },
      cta: {
        title: 'Klar for å handle?',
        subtitle: 'Bli med tusenvis av brukere som allerede kjøper og selger på BruktMarked',
        startToday: 'Start i dag'
      }
    },
    products: {
      title: 'Produkter',
      search: 'Søk produkter...',
      price: 'kr',
      view: 'Se'
    },
    footer: {
      tagline: 'Beste stedet for handel med brukte klær',
      copyright: '© 2025 BruktMarked. Alle rettigheter forbeholdt.'
    }
  },
  en: {
    app: {
      name: 'BruktMarked',
      tagline: 'Best place to buy and sell used clothes'
    },
    nav: {
      products: 'Products',
      login: 'Login',
      register: 'Join',
      profile: 'Profile'
    },
    home: {
      title: '🛍️ BruktMarked',
      subtitle: 'The best place to buy and sell used clothes. Find unique items at great prices!',
      browseProducts: 'Browse products',
      joinUs: 'Join us',
      stats: {
        products: 'Products',
        users: 'Users',
        sold: 'Sold items'
      },
      categories: {
        title: 'Popular categories',
        shirts: 'Shirts & Blouses',
        shirtsDesc: 'Elegant and casual',
        pants: 'Pants & Jeans',
        pantsDesc: 'In every style',
        dresses: 'Dresses',
        dressesDesc: 'For every occasion',
        shoes: 'Shoes',
        shoesDesc: 'Sports and elegant'
      },
      howItWorks: {
        title: 'How it works?',
        step1: '1. Register',
        step1Desc: 'Create a free account in seconds',
        step2: '2. Add product',
        step2Desc: 'Take photos and describe your clothes',
        step3: '3. Sell',
        step3Desc: 'Receive payments directly through Vipps'
      },
      cta: {
        title: 'Ready to trade?',
        subtitle: 'Join thousands of users who already buy and sell on BruktMarked',
        startToday: 'Start today'
      }
    },
    products: {
      title: 'Products',
      search: 'Search products...',
      price: 'kr',
      view: 'View'
    },
    footer: {
      tagline: 'Best place for trading used clothes',
      copyright: '© 2025 BruktMarked. All rights reserved.'
    }
  },
  pl: {
    app: {
      name: 'BruktMarked',
      tagline: 'Najlepsze miejsce do kupna i sprzedaży używanych ubrań'
    },
    nav: {
      products: 'Produkty',
      login: 'Logowanie',
      register: 'Dołącz',
      profile: 'Profil'
    },
    home: {
      title: '🛍️ BruktMarked',
      subtitle: 'Najlepsze miejsce do kupna i sprzedaży używanych ubrań. Znajdź unikalne rzeczy w świetnych cenach!',
      browseProducts: 'Przeglądaj produkty',
      joinUs: 'Dołącz do nas',
      stats: {
        products: 'Produktów',
        users: 'Użytkowników',
        sold: 'Sprzedanych rzeczy'
      },
      categories: {
        title: 'Popularne kategorie',
        shirts: 'Koszule i bluzki',
        shirtsDesc: 'Eleganckie i casualowe',
        pants: 'Spodnie i jeansy',
        pantsDesc: 'W każdym stylu',
        dresses: 'Sukienki',
        dressesDesc: 'Na każdą okazję',
        shoes: 'Buty',
        shoesDesc: 'Sportowe i eleganckie'
      },
      howItWorks: {
        title: 'Jak to działa?',
        step1: '1. Zarejestruj się',
        step1Desc: 'Stwórz darmowe konto w kilka sekund',
        step2: '2. Dodaj produkt',
        step2Desc: 'Zrób zdjęcia i opisz swoje ubrania',
        step3: '3. Sprzedaj',
        step3Desc: 'Otrzymuj płatności bezpośrednio przez Vipps'
      },
      cta: {
        title: 'Gotowy na handel?',
        subtitle: 'Dołącz do tysięcy użytkowników, którzy już kupują i sprzedają na BruktMarked',
        startToday: 'Rozpocznij już dziś'
      }
    },
    products: {
      title: 'Produkty',
      search: 'Szukaj produktów...',
      price: 'zł',
      view: 'Zobacz'
    },
    footer: {
      tagline: 'Najlepsze miejsce na handel używanymi ubraniami',
      copyright: '© 2025 BruktMarked. Wszystkie prawa zastrzeżone.'
    }
  }
}

export const useSimpleI18n = () => {
  const setLocale = (locale: string) => {
    if (translations[locale as keyof typeof translations]) {
      currentLocale.value = locale
      if (process.client) {
        localStorage.setItem('selected-language', locale)
      }
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[currentLocale.value as keyof typeof translations]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  const initLocale = () => {
    if (process.client) {
      const saved = localStorage.getItem('selected-language')
      if (saved && translations[saved as keyof typeof translations]) {
        currentLocale.value = saved
      }
    }
  }

  const locale = computed(() => currentLocale.value)

  return {
    t,
    locale,
    setLocale,
    initLocale
  }
}