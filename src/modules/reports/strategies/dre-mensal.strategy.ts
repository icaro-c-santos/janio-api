import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class DreMensalStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para DRE Mensal
    // Por enquanto, retorna um resultado mock
    return {
      fileKey: `dre-mensal-${Date.now()}.pdf`,
      metadata: {
        period: metadata?.period || new Date().toISOString().slice(0, 7),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
