import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class EstoqueAnualStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para Estoque Anual
    // Por enquanto, retorna um resultado mock
    return {
      fileKey: `estoque-anual-${Date.now()}.pdf`,
      metadata: {
        year: metadata?.year || new Date().getFullYear(),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
