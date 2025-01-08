// server/api/upload.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { defineEventHandler, readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)
    if (!files?.[0]) {
      throw new Error('No file uploaded')
    }

    const file = files[0]
    const fileExt = file.filename.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = join('public', 'uploads', fileName)

    await writeFile(filePath, file.data)

    return {
      success: true,
      url: `/uploads/${fileName}`
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})
