import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class VendasAnualGeralStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para Vendas Anual Geral
    // Por enquanto, retorna um resultado mock
    return {
      fileKey: `vendas-anual-geral-${Date.now()}.pdf`,
      metadata: {
        year: metadata?.year || new Date().getFullYear(),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
