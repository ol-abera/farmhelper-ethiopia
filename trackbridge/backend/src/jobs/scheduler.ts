import cron from 'node-cron';
import { logger } from '../config/logger.js';
import { runReminders } from './reminderJob.js';
import { runEarlyWarnings } from './earlyWarningJob.js';

export function startScheduler() {
  cron.schedule('15 6 * * *', async () => {
    try {
      await runReminders();
      await runEarlyWarnings();
    } catch (err) {
      logger.error({ err }, 'scheduled job failed');
    }
  });
}
