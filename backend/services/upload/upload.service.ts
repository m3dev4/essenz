import AppError from '../../middlewares/AppError'
import cloudinary from '../../config/cloudinary.config'


export class UploadService {
  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new AppError('Aucun fichier fourni', 400, true, 'No file provided')
    }
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'essenz-plus/avatars',
          transformation: [{ width: 300, height: 300, crop: 'fill' }],
        },
        (error: any, result: any) => {
          if (error) {
            return reject(new AppError(error.message, 500, true, error.message))
          }
          resolve(result?.secure_url || '')
        }
      )
      stream.end(file.buffer)
    })
  }
}