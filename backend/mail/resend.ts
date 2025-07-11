import { Resend } from 'resend';
import { envConfig } from '../config/env.config';
import { EmailVerificationTemplate } from '../templates/EmailVerificationTemplate';

const resend = new Resend(envConfig.RESEND_API);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Essenz+ <onboarding@resend.dev>', // Utilisez le domaine par défaut de Resend
      to: email,
      subject: 'Vérifiez votre adresse email - Essenz+',
      html: EmailVerificationTemplate({ email, token }), // HTML au lieu de React
    });

    if (error) {
      console.error('Erreur Resend:', error);
      throw new Error(`Erreur envoi email: ${error.message}`);
    }

    console.log('Email envoyé avec succès:', data);
    return data;
  } catch (error) {
    console.error("Erreur lors de l'envoi:", error);
    throw error;
  }
};
