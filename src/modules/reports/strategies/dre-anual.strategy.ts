import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class DreAnualStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para DRE Anual
    // Por enquanto, retorna um resultado mock
    return {
      fileKey: `dre-anual-${Date.now()}.pdf`,
      metadata: {
        year: metadata?.year || new Date().getFullYear(),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
