import { ReportTypeDomain } from '../domain/report.interface';
import { IReportStrategy } from './report-strategy.interface';
import { DreMensalStrategy } from './dre-mensal.strategy';
import { DreAnualStrategy } from './dre-anual.strategy';
import { VendasMensalPorClienteStrategy } from './vendas-mensal-por-cliente.strategy';
import { VendasMensalGeralStrategy } from './vendas-mensal-geral.strategy';
import { VendasAnualPorClienteStrategy } from './vendas-anual-por-cliente.strategy';
import { VendasAnualGeralStrategy } from './vendas-anual-geral.strategy';
import { EstoqueMensalStrategy } from './estoque-mensal.strategy';
import { EstoqueAnualStrategy } from './estoque-anual.strategy';

export class ReportStrategyFactory {
  private strategies: Map<ReportTypeDomain, IReportStrategy>;

  constructor() {
    this.strategies = new Map();
    this.initializeStrategies();
  }

  private initializeStrategies() {
    this.strategies.set(ReportTypeDomain.DRE_MENSAL, new DreMensalStrategy());
    this.strategies.set(ReportTypeDomain.DRE_ANUAL, new DreAnualStrategy());
    this.strategies.set(
      ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE,
      new VendasMensalPorClienteStrategy(),
    );
    this.strategies.set(
      ReportTypeDomain.VENDAS_MENSAL_GERAL,
      new VendasMensalGeralStrategy(),
    );
    this.strategies.set(
      ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE,
      new VendasAnualPorClienteStrategy(),
    );
    this.strategies.set(
      ReportTypeDomain.VENDAS_ANUAL_GERAL,
      new VendasAnualGeralStrategy(),
    );
    this.strategies.set(
      ReportTypeDomain.ESTOQUE_MENSAL,
      new EstoqueMensalStrategy(),
    );
    this.strategies.set(
      ReportTypeDomain.ESTOQUE_ANUAL,
      new EstoqueAnualStrategy(),
    );
  }

  getStrategy(reportType: ReportTypeDomain): IReportStrategy {
    const strategy = this.strategies.get(reportType);
    if (!strategy) {
      throw new Error(`Strategy not found for report type: ${reportType}`);
    }
    return strategy;
  }
}
