import { rateLimit } from 'express-rate-limit'

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limitation de 10 requetes par minute
  message: 'Trop de tentatives, veuillez reessayer plus tard',
  standardHeaders: true, // Retourne les headers standard
  legacyHeaders: false, // Désactive les headers legacy
})

export default limit
