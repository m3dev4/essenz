export const EmailVerificationTemplate = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h2>Vérifiez votre compte Essenz+</h2>
        <p>Votre code de vérification :</p>
        <div style="font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: #f0f4ff; border-radius: 8px;">
          ${token}
        </div>
        <p>Entrez ce code sur l'application pour vérifier votre compte.</p>
        <p>Ce code expire dans 1 heure.</p>
      </body>
    </html>
  `;
};

export const sendMailSessionVerifyTemplate = ({
  email,
  sessiondata,
}: {
  email: string;
  sessiondata: {
    ipAdress: string;
    userAgent: string;
    deviceType: string;
    browser?: string;
    os?: string;
    location: string;
  };
}) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle connexion détectée - Essenz+</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            Essenz+
          </h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
            Sécurité de votre compte
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 40px 30px;">
          
          <!-- Alert Icon -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 60px; height: 60px; background-color: #fef3c7; border-radius: 50%; position: relative;">
              <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px;">🔐</span>
            </div>
          </div>

          <!-- Title -->
          <h2 style="color: #1e293b; font-size: 24px; font-weight: 600; text-align: center; margin: 0 0 20px 0;">
            Nouvelle connexion détectée
          </h2>

          <!-- Description -->
          <p style="color: #64748b; font-size: 16px; text-align: center; margin: 0 0 30px 0;">
            Bonjour,<br>
            Une nouvelle connexion a été détectée sur votre compte <strong>${email}</strong> le ${currentDate}.
          </p>

          <!-- Session Details Card -->
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; display: flex; align-items: center;">
              <span style="margin-right: 8px;">📱</span>
              Détails de la connexion
            </h3>
            
            <div style="display: grid; gap: 15px;">
              
              <!-- IP Address -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-weight: 500;">Adresse IP :</span>
                <span style="color: #374151; font-weight: 600; font-family: 'Courier New', monospace;">${sessiondata.ipAdress}</span>
              </div>

              <!-- Location -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-weight: 500;">Localisation :</span>
                <span style="color: #374151; font-weight: 600;">${sessiondata.location}</span>
              </div>

              <!-- Device Type -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-weight: 500;">Appareil :</span>
                <span style="color: #374151; font-weight: 600;">${sessiondata.deviceType}</span>
              </div>

              ${
                sessiondata.browser
                  ? `
              <!-- Browser -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-weight: 500;">Navigateur :</span>
                <span style="color: #374151; font-weight: 600;">${sessiondata.browser}</span>
              </div>
              `
                  : ''
              }

              ${
                sessiondata.os
                  ? `
              <!-- Operating System -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                <span style="color: #6b7280; font-weight: 500;">Système :</span>
                <span style="color: #374151; font-weight: 600;">${sessiondata.os}</span>
              </div>
              `
                  : ''
              }

            </div>
          </div>

          <!-- Security Message -->
          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: flex-start;">
              <span style="font-size: 20px; margin-right: 12px; margin-top: 2px;">✅</span>
              <div>
                <h4 style="color: #065f46; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                  C'était vous ?
                </h4>
                <p style="color: #047857; font-size: 14px; margin: 0; line-height: 1.5;">
                  Si cette connexion provient de vous, aucune action n'est requise. Votre compte est sécurisé.
                </p>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <div style="display: flex; align-items: flex-start;">
              <span style="font-size: 20px; margin-right: 12px; margin-top: 2px;">⚠️</span>
              <div>
                <h4 style="color: #dc2626; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                  Ce n'était pas vous ?
                </h4>
                <p style="color: #b91c1c; font-size: 14px; margin: 0 0 15px 0; line-height: 1.5;">
                  Si vous ne reconnaissez pas cette activité, votre compte pourrait être compromis. Prenez immédiatement les mesures suivantes :
                </p>
                <ul style="color: #b91c1c; font-size: 14px; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 5px;">Changez votre mot de passe immédiatement</li>
                  <li style="margin-bottom: 5px;">Vérifiez vos paramètres de sécurité</li>
                  <li>Contactez notre support si nécessaire</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="#" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 10px 10px 0; transition: all 0.3s ease;">
              Sécuriser mon compte
            </a>
            <a href="#" style="display: inline-block; background-color: #f8fafc; color: #374151; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; border: 1px solid #d1d5db; margin: 0 10px 10px 0;">
              Contacter le support
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
            Cet email a été envoyé automatiquement pour votre sécurité.
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Essenz+. Tous droits réservés.
          </p>
          <div style="margin-top: 20px;">
            <a href="#" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 15px;">Politique de confidentialité</a>
            <a href="#" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 15px;">Conditions d'utilisation</a>
            <a href="#" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 15px;">Se désabonner</a>
          </div>
        </div>

      </div>
    </body>
    </html>
  `;
};
