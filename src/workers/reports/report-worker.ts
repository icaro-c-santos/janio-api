import * as cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { ReportProcessorService } from './report-processor.service';
import { getWorkerConfig } from '../config/worker.config';

class ReportWorker {
  private prisma: PrismaClient;

  private reportProcessor: ReportProcessorService;
  private isRunning: boolean = false;

  constructor() {
    this.prisma = new PrismaClient();
    this.reportProcessor = new ReportProcessorService(this.prisma);
  }

  async start(): Promise<void> {
    const config = getWorkerConfig();

    console.log('[ReportWorker] Starting report worker...');
    console.log(
      `[ReportWorker] Config: ${config.cronExpression} (${config.timezone})`,
    );

    // Configurar o cron job
    cron.schedule(
      config.cronExpression,
      async () => {
        if (this.isRunning) {
          console.log('[ReportWorker] Previous job still running, skipping...');
          return;
        }

        this.isRunning = true;
        try {
          await this.reportProcessor.processPendingReports();
        } catch (error) {
          console.error('[ReportWorker] Error in scheduled job:', error);
        } finally {
          this.isRunning = false;
        }
      },
      {
        scheduled: true,
        timezone: config.timezone,
      },
    );

    console.log(
      `[ReportWorker] Report worker started. Processing ${config.cronExpression}.`,
    );

    // Processar imediatamente na inicialização
    await this.reportProcessor.processPendingReports();
  }

  async stop(): Promise<void> {
    console.log('[ReportWorker] Stopping report worker...');
    await this.prisma.$disconnect();
    console.log('[ReportWorker] Report worker stopped.');
  }

  // Método para processar manualmente (útil para testes)
  async processNow(): Promise<void> {
    console.log('[ReportWorker] Manual processing triggered...');
    await this.reportProcessor.processPendingReports();
  }
}

// Inicializar o worker se este arquivo for executado diretamente
if (require.main === module) {
  const worker = new ReportWorker();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('[ReportWorker] Received SIGINT, shutting down gracefully...');
    await worker.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('[ReportWorker] Received SIGTERM, shutting down gracefully...');
    await worker.stop();
    process.exit(0);
  });

  // Iniciar o worker
  worker.start().catch((error) => {
    console.error('[ReportWorker] Failed to start worker:', error);
    process.exit(1);
  });
}

export { ReportWorker };
