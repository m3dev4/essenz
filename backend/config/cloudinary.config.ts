import { v2 as cloudinary } from 'cloudinary'
import { envConfig } from './env.config'

cloudinary.config({
  cloud_name: 'dabxqza6l',
  api_key: envConfig.CLOUDINARY_KEY,
  api_secret: envConfig.CLOUDINARY_KEY_SECRET,
  secure: true
})

export default cloudinary
