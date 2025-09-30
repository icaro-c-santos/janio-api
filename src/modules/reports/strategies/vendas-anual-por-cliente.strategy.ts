import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class VendasAnualPorClienteStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para Vendas Anual por Cliente
    // Por enquanto, retorna um resultado mock
    const customerId = metadata?.customerId;
    if (!customerId) {
      throw new Error('Customer ID is required for this report type');
    }

    return {
      fileKey: `vendas-anual-cliente-${customerId}-${Date.now()}.pdf`,
      metadata: {
        customerId,
        year: metadata?.year || new Date().getFullYear(),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
