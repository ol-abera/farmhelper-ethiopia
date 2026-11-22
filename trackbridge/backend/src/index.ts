import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './db/prisma.js';
import { startScheduler } from './jobs/scheduler.js';

async function main() {
  await prisma.$connect();
  startScheduler();
  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'TrackBridge API listening');
  });
}

main().catch((err) => {
  logger.error({ err }, 'failed to start');
  process.exit(1);
});
