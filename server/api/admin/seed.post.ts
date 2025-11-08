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

        // Zdjęcia przykładowe dla różnych kategorii
        const categoryImages = {
          'sukienki': [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
            'https://images.unsplash.com/photo-1566479179817-0f68b7c55295?w=400',
            'https://images.unsplash.com/photo-1564245013866-e06fb05b5d8a?w=400',
            'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400'
          ],
          'spodnie': [
            'https://images.unsplash.com/photo-1542272454315-7ad0331de1f6?w=400',
            'https://images.unsplash.com/photo-1584546406950-90de6e0b21b9?w=400',
            'https://images.unsplash.com/photo-1541840031508-326b77c9a17e?w=400',
            'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400'
          ],
          'swetry': [
            'https://images.unsplash.com/photo-1571455786673-1d69567caeea?w=400',
            'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
            'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
            'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'
          ],
          'buty': [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
            'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
            'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400'
          ],
          'kurtki': [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
            'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400'
          ],
          'koszulki': [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400',
            'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
          ],
          'spodnice': [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400',
            'https://images.unsplash.com/photo-1582142306909-195724d87ad4?w=400',
            'https://images.unsplash.com/photo-1609205103214-ba1618b5fd45?w=400',
            'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400'
          ],
          'akcesoria': [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
            'https://images.unsplash.com/photo-1553735237-7be4ad9fb7dd?w=400',
            'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400'
          ],
          'sportowe': [
            'https://images.unsplash.com/photo-1506629905496-bd4ff5c7000f?w=400',
            'https://images.unsplash.com/photo-1571019613540-996a0b2d2f9b?w=400',
            'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'
          ]
        }

        // Dodaj produkty losowo przypisując do użytkowników
        for (const productData of sampleProducts) {
          const randomUser = users[Math.floor(Math.random() * users.length)]
          
          // Pobierz odpowiednie zdjęcia dla kategorii
          const categoryImages_for_product = categoryImages[productData.category as keyof typeof categoryImages] || categoryImages['koszulki']
          
          const product = await prisma.product.create({
            data: {
              ...productData,
              images: JSON.stringify(categoryImages_for_product),
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