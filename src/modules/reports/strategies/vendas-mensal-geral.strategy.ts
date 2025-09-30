import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class VendasMensalGeralStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para Vendas Mensal Geral
    // Por enquanto, retorna um resultado mock
    return {
      fileKey: `vendas-mensal-geral-${Date.now()}.pdf`,
      metadata: {
        period: metadata?.period || new Date().toISOString().slice(0, 7),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
