import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { mailer } from './mailer.js';

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  try {
    const info = await mailer.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      text,
      html: html ?? `<pre>${text}</pre>`,
    });
    if (!env.SMTP_HOST) {
      logger.info({ to, subject, preview: info.message }, 'email (dev transport)');
    }
    return true;
  } catch (err) {
    logger.error({ err, to, subject }, 'email failed');
    return false;
  }
}
