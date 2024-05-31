import { emailRepository } from '../repositories/emailRepository';

class EmailService {
  async sendRegisterEmail(to: string, confirmationLink: string) {
    const subject = 'Confirm your email address';
    const text = `Please confirm your email address by clicking the following link: ${confirmationLink}`;
    const html = `<p>Please confirm your email address by clicking the link below:</p><p><a href="${confirmationLink}">Confirm Email</a></p>`;

    await emailRepository.sendMail(to, subject, text, html);
  }
}

export const emailService = new EmailService();
