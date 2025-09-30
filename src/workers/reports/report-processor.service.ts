/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { PrismaClient } from '@prisma/client';
import { ReportRepository } from '../../modules/reports/repository/report.repository';
import { ReportStrategyFactory } from '../../modules/reports/strategies/report-strategy.factory';
import {
  ReportDomain,
  ReportStatusDomain,
} from '../../modules/reports/domain/report.interface';
import { getWorkerConfig } from '../config/worker.config';

export class ReportProcessorService {
  private reportRepository: ReportRepository;

  private reportStrategyFactory: ReportStrategyFactory;

  constructor(private prisma: PrismaClient) {
    this.reportRepository = new ReportRepository(prisma);
    this.reportStrategyFactory = new ReportStrategyFactory();
  }

  async processPendingReports(): Promise<void> {
    try {
      console.log('[ReportProcessor] Starting to process pending reports...');

      const config = getWorkerConfig();

      const pendingReports = await this.reportRepository.findAll({
        skip: 0,
        take: config.maxReportsPerBatch,
        status: ReportStatusDomain.PENDING,
      });

      if (pendingReports.items.length === 0) {
        console.log('[ReportProcessor] No pending reports found.');
        return;
      }

      console.log(
        `[ReportProcessor] Found ${pendingReports.items.length} pending reports.`,
      );

      for (const report of pendingReports.items) {
        await this.processReport(report.id);
      }

      console.log('[ReportProcessor] Finished processing pending reports.');
    } catch (error) {
      console.error(
        '[ReportProcessor] Error processing pending reports:',
        error,
      );
    }
  }

  private async processReport(reportId: string): Promise<void> {
    let report: ReportDomain | null = null;

    try {
      console.log(`[ReportProcessor] Processing report ${reportId}...`);

      await this.reportRepository.update(reportId, {
        status: ReportStatusDomain.PROCESSING,
      });

      report = await this.reportRepository.findById(reportId);
      if (!report) {
        console.error(`[ReportProcessor] Report ${reportId} not found.`);
        return;
      }

      const strategy = this.reportStrategyFactory.getStrategy(report.type);

      const result = await strategy.execute(report.metadata);

      await this.reportRepository.update(reportId, {
        status: ReportStatusDomain.READY,
        fileKey: result.fileKey,
        metadata: {
          ...report.metadata,
          ...result.metadata,
          processedAt: new Date().toISOString(),
        },
      });

      console.log(
        `[ReportProcessor] Report ${reportId} processed successfully.`,
      );
    } catch (error) {
      console.error(
        `[ReportProcessor] Error processing report ${reportId}:`,
        error,
      );

      try {
        await this.reportRepository.update(reportId, {
          status: ReportStatusDomain.FAILED,
          metadata: {
            ...report?.metadata,
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString(),
          },
        });
      } catch (updateError) {
        console.error(
          `[ReportProcessor] Error updating failed report ${reportId}:`,
          updateError,
        );
      }
    }
  }
}
