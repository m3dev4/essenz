export const EmailVerificationTemplate = ({ email, token }: { email: string; token: string }) => {
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
