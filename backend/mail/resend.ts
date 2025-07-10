import { Resend } from 'resend';
import { envConfig } from '../config/env.config';
import { EmailVerificationTemplate } from '../templates/EmailVerificationTemplate';

const resend = new Resend(envConfig.RESEND_API);

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: 'Essenz+ <noreply@essenz.com>',
    to: email,
    subject: 'Verify your email address',
    react: EmailVerificationTemplate({ email, token }),
  });
};
