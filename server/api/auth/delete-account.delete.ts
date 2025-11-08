import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'DELETE') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)

    // Delete user account and all related data
    await prisma.$transaction(async (tx) => {
      // Delete user's likes
      await tx.like.deleteMany({
        where: { userId: user.id }
      })

      // Delete user's messages (both sent and received)
      await tx.message.deleteMany({
        where: {
          OR: [
            { senderId: user.id },
            { receiverId: user.id }
          ]
        }
      })

      // Delete user's sales
      await tx.sale.deleteMany({
        where: { sellerId: user.id }
      })

      // Delete user's purchases
      await tx.purchase.deleteMany({
        where: { buyerId: user.id }
      })

      // Delete user's products
      await tx.product.deleteMany({
        where: { sellerId: user.id }
      })

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id }
      })
    })

    return { success: true }
  } catch (error: any) {
    console.error('Delete account error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd usuwania konta'
    })
  }
})