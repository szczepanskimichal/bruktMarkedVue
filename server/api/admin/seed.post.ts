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
    // Sprawdź czy admin już istnieje
    const existingAdmin = await prisma.user.findFirst({
      where: { isAdmin: true }
    })

    if (existingAdmin) {
      return {
        message: 'Administrator już istnieje',
        admin: {
          email: existingAdmin.email,
          username: existingAdmin.username
        }
      }
    }

    // Stwórz administratora
    const hashedPassword = await bcrypt.hash('admin123', 12)

    const admin = await prisma.user.create({
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

    const { password: _, ...adminWithoutPassword } = admin

    return {
      message: 'Administrator utworzony pomyślnie',
      admin: adminWithoutPassword,
      credentials: {
        email: 'admin@bruktmarked.no',
        password: 'admin123'
      }
    }
  } catch (error: any) {
    console.error('Seed admin error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd tworzenia administratora'
    })
  }
})