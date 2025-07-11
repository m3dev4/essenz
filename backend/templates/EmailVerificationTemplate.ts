import { envConfig } from '../config/env.config';

export const EmailVerificationTemplate = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const verificationUrl = `${envConfig.APP_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérifiez votre email - essenz+</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; font-size: 32px; font-weight: bold; margin: 0;">
              essenz<span style="color: #fbbf24;">+</span>
            </h1>
            <p style="color: #e2e8f0; font-size: 16px; margin: 8px 0 0 0;">L'essentiel, simplifié</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 80px; height: 80px; background: #f0f4ff; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; border: 3px solid #667eea;">
                <span style="font-size: 32px;">✉️</span>
              </div>

              <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">
                Vérifiez votre adresse email
              </h2>

              <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Bonjour ! Merci de vous être inscrit sur <strong>essenz+</strong>. 
                Pour finaliser votre inscription, cliquez sur le bouton ci-dessous.
              </p>

              <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 32px;">
                <strong>Email :</strong> ${email}
              </div>
            </div>

            <!-- Button -->
            <div style="text-align: center; margin-bottom: 32px;">
              <a href="${verificationUrl}" 
                 style="display: inline-block; background: #667eea; color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                Vérifier mon email
              </a>
            </div>

            <!-- Alternative link -->
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 14px; margin: 0 0 12px 0;">
                Le bouton ne fonctionne pas ? Copiez ce lien :
              </p>
              <p style="color: #667eea; font-size: 12px; word-break: break-all; background: white; padding: 8px; border-radius: 4px;">
                ${verificationUrl}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">
              Ce lien expire dans <strong>24 heures</strong>. 
              Si vous n'avez pas créé de compte, ignorez cet email.
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              © 2024 essenz+. Tous droits réservés.<br>
              Email envoyé à ${email}
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};
