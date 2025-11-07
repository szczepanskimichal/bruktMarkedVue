import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const verifyToken = async (token: string) => {
  try {
    const config = useRuntimeConfig()
    const decoded = jwt.verify(token, config.jwtSecret) as any
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        city: true,
        isAdmin: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!user || !user.isActive) {
      throw new Error('User not found or inactive')
    }

    return user
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export const requireAuth = async (event: any) => {
  const authorization = getHeader(event, 'authorization')
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authorization required'
    })
  }

  const token = authorization.substring(7)
  const user = await verifyToken(token)
  
  // Add user to event context
  event.context.user = user
  
  return user
}

export const requireAdmin = async (event: any) => {
  const user = await requireAuth(event)
  
  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
  
  return user
}