import { PrismaClient } from '@prisma/client'
import { requireAuth } from '../../utils/auth'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const prisma = new PrismaClient()

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    // Sprawdź autentykację
    const user = await requireAuth(event)

    // Parse multipart form data
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return mimetype && mimetype.includes('image')
      }
    })

    const [fields, files] = await form.parse(event.node.req)
    
    if (!files.images || files.images.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Brak zdjęć do uploadu'
      })
    }

    // Upload do Cloudinary
    const imageUrls: string[] = []
    
    for (const file of files.images) {
      if (!file.filepath) continue
      
      try {
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'bruktmarked/products',
          public_id: `${user.id}_${Date.now()}`,
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        })
        
        imageUrls.push(result.secure_url)
        
        // Usuń tymczasowy plik
        fs.unlinkSync(file.filepath)
      } catch (uploadError) {
        console.error('Upload error:', uploadError)
      }
    }

    if (imageUrls.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Błąd podczas uploadu zdjęć'
      })
    }

    return {
      success: true,
      images: imageUrls,
      count: imageUrls.length
    }

  } catch (error: any) {
    console.error('Image upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Błąd podczas uploadu'
    })
  }
})