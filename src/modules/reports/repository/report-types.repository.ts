import {
  ReportTypeDomain,
  ReportStatusDomain,
} from '../domain/report.interface';
import {
  ReportTypeInfo,
  ReportStatusInfo,
  GetReportTypesResponse,
} from '../usecases/types/getReportTypes.types';

export interface IReportTypesRepository {
  getReportTypes(): Promise<GetReportTypesResponse>;
}

export class ReportTypesRepository implements IReportTypesRepository {
  async getReportTypes(): Promise<GetReportTypesResponse> {
    const types: ReportTypeInfo[] = Object.values(ReportTypeDomain).map(
      (type) => ({
        value: type,
        label: this.getReportTypeLabel(type),
        description: this.getReportTypeDescription(type),
      }),
    );

    const statuses: ReportStatusInfo[] = Object.values(ReportStatusDomain).map(
      (status) => ({
        value: status,
        label: this.getReportStatusLabel(status),
        description: this.getReportStatusDescription(status),
      }),
    );

    return {
      types,
      statuses,
    };
  }

  private getReportTypeLabel(type: ReportTypeDomain): string {
    const labels: Record<ReportTypeDomain, string> = {
      [ReportTypeDomain.DRE_MENSAL]: 'DRE Mensal',
      [ReportTypeDomain.DRE_ANUAL]: 'DRE Anual',
      [ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE]: 'Vendas Mensal por Cliente',
      [ReportTypeDomain.VENDAS_MENSAL_GERAL]: 'Vendas Mensal Geral',
      [ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE]: 'Vendas Anual por Cliente',
      [ReportTypeDomain.VENDAS_ANUAL_GERAL]: 'Vendas Anual Geral',
      [ReportTypeDomain.ESTOQUE_MENSAL]: 'Estoque Mensal',
      [ReportTypeDomain.ESTOQUE_ANUAL]: 'Estoque Anual',
    };
    return labels[type];
  }

  private getReportTypeDescription(type: ReportTypeDomain): string {
    const descriptions: Record<ReportTypeDomain, string> = {
      [ReportTypeDomain.DRE_MENSAL]:
        'Demonstração do Resultado do Exercício mensal',
      [ReportTypeDomain.DRE_ANUAL]:
        'Demonstração do Resultado do Exercício anual',
      [ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE]:
        'Relatório de vendas mensal para um cliente específico',
      [ReportTypeDomain.VENDAS_MENSAL_GERAL]:
        'Relatório geral de vendas mensal',
      [ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE]:
        'Relatório de vendas anual para um cliente específico',
      [ReportTypeDomain.VENDAS_ANUAL_GERAL]: 'Relatório geral de vendas anual',
      [ReportTypeDomain.ESTOQUE_MENSAL]: 'Relatório de estoque mensal',
      [ReportTypeDomain.ESTOQUE_ANUAL]: 'Relatório de estoque anual',
    };
    return descriptions[type];
  }

  private getReportStatusLabel(status: ReportStatusDomain): string {
    const labels: Record<ReportStatusDomain, string> = {
      [ReportStatusDomain.PENDING]: 'Pendente',
      [ReportStatusDomain.PROCESSING]: 'Processando',
      [ReportStatusDomain.READY]: 'Pronto',
      [ReportStatusDomain.FAILED]: 'Falhou',
    };
    return labels[status];
  }

  private getReportStatusDescription(status: ReportStatusDomain): string {
    const descriptions: Record<ReportStatusDomain, string> = {
      [ReportStatusDomain.PENDING]: 'Relatório aguardando processamento',
      [ReportStatusDomain.PROCESSING]: 'Relatório sendo processado',
      [ReportStatusDomain.READY]: 'Relatório processado e pronto para download',
      [ReportStatusDomain.FAILED]: 'Falha no processamento do relatório',
    };
    return descriptions[status];
  }
}

