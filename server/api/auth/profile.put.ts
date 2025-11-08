import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  avatar: z.string().url().optional()
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'PUT') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const profileData = updateProfileSchema.parse(body)

    // Check if username is already taken (if changing)
    if (profileData.username && profileData.username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: profileData.username }
      })

      if (existingUser) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nazwa użytkownika jest już zajęta'
        })
      }
    }

    // Check if email is already taken (if changing)
    if (profileData.email && profileData.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: profileData.email }
      })

      if (existingUser) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Email jest już zajęty'
        })
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: profileData.username,
        email: profileData.email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        address: profileData.address,
        city: profileData.city,
        avatar: profileData.avatar
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        avatar: true,
        isAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return { user: updatedUser }
  } catch (error: any) {
    console.error('Update profile error:', error)
    
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nieprawidłowe dane profilu'
      })
    }
    
    throw error
  }
})