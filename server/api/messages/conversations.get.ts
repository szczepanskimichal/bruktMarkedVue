import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'GET') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)

    // Get all conversations for the user
    // This is a complex query - we need to find all unique conversation partners
    const conversations = await prisma.$queryRaw`
      WITH conversation_partners AS (
        SELECT DISTINCT 
          CASE 
            WHEN senderId = ${user.id} THEN receiverId
            ELSE senderId 
          END as partnerId,
          productId
        FROM messages 
        WHERE senderId = ${user.id} OR receiverId = ${user.id}
      ),
      latest_messages AS (
        SELECT DISTINCT
          CASE 
            WHEN senderId = ${user.id} THEN receiverId
            ELSE senderId 
          END as partnerId,
          productId,
          id,
          content,
          senderId,
          receiverId,
          createdAt,
          isRead,
          ROW_NUMBER() OVER (
            PARTITION BY 
              CASE 
                WHEN senderId = ${user.id} THEN receiverId
                ELSE senderId 
              END,
              productId
            ORDER BY createdAt DESC
          ) as rn
        FROM messages 
        WHERE senderId = ${user.id} OR receiverId = ${user.id}
      ),
      unread_counts AS (
        SELECT 
          senderId as partnerId,
          productId,
          COUNT(*) as unread_count
        FROM messages 
        WHERE receiverId = ${user.id} AND isRead = false
        GROUP BY senderId, productId
      )
      SELECT 
        cp.partnerId,
        cp.productId,
        lm.id as lastMessageId,
        lm.content as lastMessageContent,
        lm.senderId as lastMessageSenderId,
        lm.receiverId as lastMessageReceiverId,
        lm.createdAt as lastMessageCreatedAt,
        lm.isRead as lastMessageIsRead,
        COALESCE(uc.unread_count, 0) as unreadCount
      FROM conversation_partners cp
      LEFT JOIN latest_messages lm ON cp.partnerId = lm.partnerId 
        AND cp.productId = lm.productId 
        AND lm.rn = 1
      LEFT JOIN unread_counts uc ON cp.partnerId = uc.partnerId 
        AND cp.productId = uc.productId
      ORDER BY lm.createdAt DESC
    ` as any[]

    // Get user and product details
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv: any) => {
        const [otherUser, product] = await Promise.all([
          prisma.user.findUnique({
            where: { id: conv.partnerId },
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }),
          conv.productId ? prisma.product.findUnique({
            where: { id: conv.productId },
            select: {
              id: true,
              title: true
            }
          }) : null
        ])

        return {
          id: `${conv.partnerId}-${conv.productId || 'general'}`,
          otherUser,
          product,
          lastMessage: conv.lastMessageId ? {
            id: conv.lastMessageId,
            content: conv.lastMessageContent,
            senderId: conv.lastMessageSenderId,
            receiverId: conv.lastMessageReceiverId,
            createdAt: conv.lastMessageCreatedAt,
            isRead: conv.lastMessageIsRead,
            productId: conv.productId
          } : null,
          unreadCount: Number(conv.unreadCount) || 0
        }
      })
    )

    return conversationsWithDetails.filter(conv => conv.otherUser)
  } catch (error: any) {
    console.error('Get conversations error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd pobierania konwersacji'
    })
  }
})