import { Resend } from 'resend'
import { envConfig } from '../config/env.config'
import {
  EmailVerificationTemplate,
  sendMailSessionVerifyTemplate,
} from '../templates/EmailVerificationTemplate'
import AppError from '../middlewares/AppError'

const resend = new Resend(envConfig.RESEND_API)

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Essenz+ <onboarding@resend.dev>', // Utilisez le domaine par défaut de Resend
      to: email,
      subject: 'Vérifiez votre adresse email - Essenz+',
      html: EmailVerificationTemplate({ email, token }), // HTML au lieu de React
    })

    if (error) {
      console.error('Erreur Resend:', error)
      throw new Error(`Erreur envoi email: ${error.message}`)
    }

    console.log('Email envoyé avec succès:', data)
    return data
  } catch (error) {
    console.error("Erreur lors de l'envoi:", error)
    throw error
  }
}

// Cette fonction serve à prevenir l'utlisateur d'une session qui viens d'être creer
export const sendMailSessionVerify = async (
  email: string,
  sessiondata: {
    ipAdress: string
    userAgent: string
    deviceType: string
    browser?: string
    os?: string
    location: string
  }
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Essenz+ <onboarding@resend.dev>',
      to: email,
      subject: 'Vérifiez votre adresse email - Essenz+',
      html: sendMailSessionVerifyTemplate({ email, sessiondata }),
    })

    if (error) {
      console.error('Erreur Resend:', error)
      throw new Error(`Erreur envoi email: ${error.message}`)
    }

    console.log('Email envoyé avec succès:', data)
    return data
  } catch (error: any) {
    console.error("Erreur lors de l'envoi:", error)
    throw new AppError(error.message, 500, true, error.message)
  }
}
