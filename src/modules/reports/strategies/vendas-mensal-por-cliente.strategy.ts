import {
  IReportStrategy,
  ReportStrategyResult,
} from './report-strategy.interface';

export class VendasMensalPorClienteStrategy implements IReportStrategy {
  async execute(
    metadata?: Record<string, any> | null,
  ): Promise<ReportStrategyResult> {
    // TODO: Implementar lógica para Vendas Mensal por Cliente
    // Por enquanto, retorna um resultado mock
    const customerId = metadata?.customerId;
    if (!customerId) {
      throw new Error('Customer ID is required for this report type');
    }

    return {
      fileKey: `vendas-mensal-cliente-${customerId}-${Date.now()}.pdf`,
      metadata: {
        customerId,
        period: metadata?.period || new Date().toISOString().slice(0, 7),
        generatedAt: new Date().toISOString(),
      },
    };
  }
}
