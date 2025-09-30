import { IReportRepository, ReportTypeDomain, ReportStatusDomain } from '../../domain/report.interface';
import { ReportStrategyFactory } from '../../strategies/report-strategy.factory';

export class ReportExecutionService {
  constructor(
    private reportRepository: IReportRepository,
    private reportStrategyFactory: ReportStrategyFactory,
  ) {}

  async executeReport(
    reportId: string,
    reportType: ReportTypeDomain,
    metadata?: Record<string, any> | null,
  ): Promise<void> {
    try {
      // Atualizar status para PROCESSING
      await this.reportRepository.update(reportId, {
        status: ReportStatusDomain.PROCESSING,
      });

      // Obter a strategy apropriada para o tipo de relatório
      const strategy = this.reportStrategyFactory.getStrategy(reportType);

      // Executar a strategy
      const result = await strategy.execute(metadata);

      // Atualizar o relatório com o resultado
      await this.reportRepository.update(reportId, {
        status: ReportStatusDomain.READY,
        fileKey: result.fileKey,
        metadata: result.metadata,
      });
    } catch (error) {
      // Em caso de erro, atualizar status para FAILED
      await this.reportRepository.update(reportId, {
        status: ReportStatusDomain.FAILED,
        metadata: {
          error: error instanceof Error ? error.message : 'Unknown error',
          ...metadata,
        },
      });
    }
  }
}
