import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'
import { z } from 'zod'

const prisma = new PrismaClient()

const createPaymentSchema = z.object({
  productId: z.string(),
  amount: z.number().min(1),
  paymentMethod: z.enum(['vipps', 'card'])
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const user = await requireAuth(event)
    const body = await readBody(event)
    const paymentData = createPaymentSchema.parse(body)

    // Sprawdź czy produkt istnieje
    const product = await prisma.product.findUnique({
      where: { id: paymentData.productId },
      include: { seller: true }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Produkt nie znaleziony'
      })
    }

    if (product.sellerId === user.id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nie możesz kupić własnego produktu'
      })
    }

    if (product.status !== 'active') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Produkt jest niedostępny'
      })
    }

    // Stwórz order w bazie
    const purchase = await prisma.purchase.create({
      data: {
        buyerId: user.id,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        status: 'pending'
      }
    })

    // Jeśli Vipps, stwórz płatność w API
    if (paymentData.paymentMethod === 'vipps') {
      const vippsResponse = await createVippsPayment({
        orderId: purchase.id,
        amount: paymentData.amount,
        description: `Zakup: ${product.title}`,
        redirectUrl: `${getRequestURL(event).origin}/payment/success`,
        userInfo: {
          userId: user.id,
          email: user.email
        }
      })

      // Aktualizuj z Vipps order ID
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { vippsOrderId: vippsResponse.orderId }
      })

      return {
        success: true,
        purchaseId: purchase.id,
        redirectUrl: vippsResponse.url
      }
    }

    return {
      success: true,
      purchaseId: purchase.id
    }

  } catch (error: any) {
    console.error('Payment error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd podczas płatności'
    })
  }
})

// Funkcja do Vipps API
async function createVippsPayment(orderData: any) {
  const config = useRuntimeConfig()
  
  try {
    // Tutaj będzie prawdziwe API Vipps
    const response = await fetch('https://apitest.vipps.no/ecomm/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.vippsApiKey}`,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': config.vippsClientId
      },
      body: JSON.stringify({
        customerInfo: {
          mobileNumber: orderData.userInfo.phone || '12345678'
        },
        merchantInfo: {
          merchantSerialNumber: config.vippsClientId,
          callbackPrefix: `${orderData.redirectUrl}/callback`,
          fallBack: orderData.redirectUrl
        },
        transaction: {
          amount: orderData.amount * 100, // øre (grosze)
          transactionText: orderData.description,
          orderId: orderData.orderId
        }
      })
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Vipps API error:', error)
    throw new Error('Vipps payment failed')
  }
}