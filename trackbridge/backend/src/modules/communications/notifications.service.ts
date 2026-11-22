import { prisma } from '../../db/prisma.js';
import { sendMail } from '../../mail/send.js';

export async function notify(
  userId: string,
  type: string,
  title: string,
  body: string,
  payload?: Record<string, unknown>,
  email?: { to: string; enabled: boolean },
) {
  await prisma.notification.create({
    data: { userId, type, title, body, payload: payload ?? undefined },
  });
  if (email?.enabled && email.to) {
    await sendMail(email.to, `[TrackBridge] ${title}`, body);
  }
}
