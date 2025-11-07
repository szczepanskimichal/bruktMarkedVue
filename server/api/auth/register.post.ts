import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()

const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy format email'),
  username: z.string()
    .min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki')
    .max(30, 'Nazwa użytkownika może mieć maksymalnie 30 znaków')
    .regex(/^[a-zA-Z0-9_]+$/, 'Nazwa może zawierać tylko litery, cyfry i podkreślenia'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  firstName: z.string().optional(),
  lastName: z.string().optional()
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const userData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: existingUser.email === userData.email 
          ? 'Email jest już zajęty' 
          : 'Nazwa użytkownika jest już zajęta'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
    })

    // Generate JWT token
    const config = useRuntimeConfig()
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      const firstError = error.errors[0]
      throw createError({
        statusCode: 400,
        statusMessage: firstError.message || 'Nieprawidłowe dane'
      })
    }
    throw error
  }
})