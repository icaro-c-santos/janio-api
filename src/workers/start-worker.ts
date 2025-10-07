#!/usr/bin/env node

import { ReportWorker } from './reports/report-worker';

console.log('🚀 Starting Report Worker...');
console.log('📊 Processing reports every 5 minutes');
console.log('⏰ Timezone: America/Sao_Paulo');
console.log('');

const worker = new ReportWorker();

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await worker.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await worker.stop();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await worker.stop();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  await worker.stop();
  process.exit(1);
});

// Start the worker
worker.start().catch((error) => {
  console.error('💥 Failed to start worker:', error);
  process.exit(1);
});



