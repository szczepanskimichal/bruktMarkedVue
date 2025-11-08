import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Sprawdź czy dane już zostały zainicjowane
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    })

    let admin = existingAdmin
    let newUsers = []
    let newProducts = []

    // Stwórz administratora jeśli nie istnieje
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 12)

      admin = await prisma.user.create({
        data: {
          email: 'admin@bruktmarked.no',
          username: 'admin',
          password: hashedPassword,
          firstName: 'Administrator',
          lastName: 'BruktMarked',
          isAdmin: true,
          isActive: true
        }
      })
    }

    // Sprawdź czy mamy już testowych użytkowników
    const userCount = await prisma.user.count()
    
    if (userCount < 5) {
      // Stwórz testowych użytkowników
      const testUsers = [
        {
          email: 'anna@example.com',
          username: 'anna_fashion',
          firstName: 'Anna',
          lastName: 'Kowalska',
          city: 'Oslo'
        },
        {
          email: 'marta@example.com',
          username: 'marta_style',
          firstName: 'Marta',
          lastName: 'Nowak',
          city: 'Bergen'
        },
        {
          email: 'kasia@example.com',
          username: 'kasia_vintage',
          firstName: 'Katarzyna',
          lastName: 'Wiśniewska',
          city: 'Trondheim'
        },
        {
          email: 'test@example.com',
          username: 'test_user',
          firstName: 'Test',
          lastName: 'User',
          city: 'Stavanger'
        }
      ]

      const hashedPassword = await bcrypt.hash('test123', 12)

      for (const userData of testUsers) {
        const user = await prisma.user.create({
          data: {
            ...userData,
            password: hashedPassword,
            isAdmin: false,
            isActive: true
          }
        })
        newUsers.push(user)
      }
    }

    // Sprawdź czy mamy już produkty
    const productCount = await prisma.product.count()
    
    if (productCount < 20) {
      // Pobierz użytkowników do dodania produktów
      const users = await prisma.user.findMany({
        where: { isAdmin: false }
      })

      if (users.length > 0) {
        const sampleProducts = [
          {
            title: 'Sukienka H&M w kwiaty',
            description: 'Piękna sukienka letnia w kwiaty, rozmiar M. Stan bardzo dobry, noszona kilka razy.',
            price: 89,
            category: 'sukienki',
            size: 'M',
            condition: 'bardzo dobry',
            brand: 'H&M',
            color: 'wielokolorowy'
          },
          {
            title: 'Jeansy Levi\'s 501',
            description: 'Kultowe jeansy Levi\'s 501 w rozmiarze 32/34. Klasyczny krój, stan dobry.',
            price: 150,
            category: 'spodnie',
            size: '32',
            condition: 'dobry',
            brand: 'Levi\'s',
            color: 'niebieski'
          },
          {
            title: 'Sweter wełniany Zara',
            description: 'Ciepły sweter z wełny merino. Rozmiar S, idealny na jesień.',
            price: 120,
            category: 'swetry',
            size: 'S',
            condition: 'bardzo dobry',
            brand: 'Zara',
            color: 'czarny'
          },
          {
            title: 'Buty Nike Air Max',
            description: 'Sportowe buty Nike Air Max w rozmiarze 40. Lekkie ślady używania.',
            price: 200,
            category: 'buty',
            size: '40',
            condition: 'dobry',
            brand: 'Nike',
            color: 'biały'
          },
          {
            title: 'Kurtka zimowa The North Face',
            description: 'Ciepła kurtka zimowa, puchowa. Rozmiar L, stan bardzo dobry.',
            price: 350,
            category: 'kurtki',
            size: 'L',
            condition: 'bardzo dobry',
            brand: 'The North Face',
            color: 'czarny'
          },
          {
            title: 'Bluzka Mango elegancka',
            description: 'Elegancka bluzka do pracy. Rozmiar M, kolor kremowy.',
            price: 65,
            category: 'koszulki',
            size: 'M',
            condition: 'bardzo dobry',
            brand: 'Mango',
            color: 'beżowy'
          },
          {
            title: 'Spódnica plisowana Uniqlo',
            description: 'Modna spódnica plisowana midi. Stan jak nowa.',
            price: 75,
            category: 'spodnice',
            size: 'S',
            condition: 'nowy',
            brand: 'Uniqlo',
            color: 'szary'
          },
          {
            title: 'T-shirt vintage band',
            description: 'Vintage t-shirt zespołu rockowego. Unikatowy, stan zadowalający.',
            price: 45,
            category: 'koszulki',
            size: 'L',
            condition: 'zadowalający',
            brand: 'Vintage',
            color: 'czarny'
          },
          {
            title: 'Torebka skórzana Coach',
            description: 'Autentyczna torebka Coach ze skóry naturalnej. Stan bardzo dobry.',
            price: 280,
            category: 'akcesoria',
            condition: 'bardzo dobry',
            brand: 'Coach',
            color: 'brązowy'
          },
          {
            title: 'Legginsy sportowe Adidas',
            description: 'Wysokiej jakości legginsy do ćwiczeń. Rozmiar M.',
            price: 55,
            category: 'sportowe',
            size: 'M',
            condition: 'bardzo dobry',
            brand: 'Adidas',
            color: 'czarny'
          },
          {
            title: 'Płaszcz wełniany COS',
            description: 'Minimalistyczny płaszcz wełniany. Rozmiar M, stan idealny.',
            price: 450,
            category: 'kurtki',
            size: 'M',
            condition: 'nowy',
            brand: 'COS',
            color: 'szary'
          },
          {
            title: 'Buty na obcasie Zara',
            description: 'Eleganckie czółenka na obcasie. Rozmiar 38.',
            price: 85,
            category: 'buty',
            size: '38',
            condition: 'dobry',
            brand: 'Zara',
            color: 'czarny'
          },
          {
            title: 'Kardigan oversize H&M',
            description: 'Modny kardigan oversize w kolorze camel. Rozmiar L.',
            price: 95,
            category: 'swetry',
            size: 'L',
            condition: 'bardzo dobry',
            brand: 'H&M',
            color: 'beżowy'
          },
          {
            title: 'Szorty jeansowe Levi\'s',
            description: 'Klasyczne szorty jeansowe. Rozmiar 29, stan dobry.',
            price: 70,
            category: 'spodnie',
            size: '29',
            condition: 'dobry',
            brand: 'Levi\'s',
            color: 'niebieski'
          },
          {
            title: 'Koszula w kratę Uniqlo',
            description: 'Flanelowa koszula w kratę. Rozmiar L, bardzo wygodna.',
            price: 60,
            category: 'koszulki',
            size: 'L',
            condition: 'bardzo dobry',
            brand: 'Uniqlo',
            color: 'wielokolorowy'
          }
        ]

        // Dodaj produkty losowo przypisując do użytkowników
        for (const productData of sampleProducts) {
          const randomUser = users[Math.floor(Math.random() * users.length)]
          
          const product = await prisma.product.create({
            data: {
              ...productData,
              images: JSON.stringify(['/api/placeholder/300/400', '/api/placeholder/300/400']),
              sellerId: randomUser.id,
              views: Math.floor(Math.random() * 100) + 1,
              status: 'active'
            }
          })
          
          newProducts.push(product)
        }
      }
    }

    const { password: _, ...adminWithoutPassword } = admin

    return {
      message: 'Dane testowe utworzone pomyślnie',
      admin: adminWithoutPassword,
      stats: {
        totalUsers: await prisma.user.count(),
        totalProducts: await prisma.product.count(),
        newUsersCreated: newUsers.length,
        newProductsCreated: newProducts.length
      },
      credentials: {
        admin: { email: 'admin@bruktmarked.no', password: 'admin123' },
        testUser: { email: 'test@example.com', password: 'test123' }
      }
    }
  } catch (error: any) {
    console.error('Seed error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd tworzenia danych testowych'
    })
  }
})