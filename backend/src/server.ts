import app from './app';
import { connectDB } from './config/database';
import { logger } from './config/logger';
import { env } from './config/env';

const PORT = env.PORT;

async function startServer(): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    logger.warn('⚠️ MongoDB connection warning (Ensure MongoDB is running for DB operations):', error);
  }

  app.listen(PORT, () => {
    logger.info(`🚀 SciCollab API running on port ${PORT} [${env.NODE_ENV}]`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
