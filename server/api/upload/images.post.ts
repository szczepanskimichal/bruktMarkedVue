import { requireAuth } from '../../utils/auth'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

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

    // Ścieżka do folderu uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Upewnij się, że folder istnieje
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Parse multipart form data
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: ({ mimetype }) => {
        return Boolean(mimetype && mimetype.includes('image'))
      }
    })

    const [fields, files] = await form.parse(event.node.req)
    
    if (!files.images) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Brak zdjęć do uploadu'
      })
    }

    // Lokalne przechowywanie obrazów
    const imageUrls: string[] = []
    
    const fileArray = Array.isArray(files.images) ? files.images : [files.images]
    
    for (const file of fileArray) {
      if (!file.filepath || !file.originalFilename) continue
      
      try {
        // Generuj unikalne ID dla pliku
        const fileId = crypto.randomUUID()
        const fileExtension = path.extname(file.originalFilename)
        const fileName = `${user.id}_${fileId}${fileExtension}`
        const filePath = path.join(uploadsDir, fileName)
        
        // Skopiuj plik do public/uploads
        fs.copyFileSync(file.filepath, filePath)
        
        // Dodaj URL do listy (relatywny do public)
        imageUrls.push(`/uploads/${fileName}`)
        
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
      statusMessage: error.statusMessage || 'Błąd podczas uploadu'
    })
  }
})