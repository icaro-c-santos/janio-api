import { Report as ReportEntity } from '@prisma/client';
import {
  ReportDomain,
  ReportStatusDomain,
  ReportTypeDomain,
} from '../../domain/report.interface';

export class ReportRepositoryMap {
  private static mapStatus(prismaStatus: string): ReportStatusDomain {
    switch (prismaStatus) {
      case 'PROCESSING':
        return ReportStatusDomain.PROCESSING;
      case 'PENDING':
        return ReportStatusDomain.PENDING;
      case 'READY':
        return ReportStatusDomain.READY;
      case 'FAILED':
        return ReportStatusDomain.FAILED;
      default:
        return ReportStatusDomain.PENDING;
    }
  }

  private static mapType(prismaType: string): ReportTypeDomain {
    switch (prismaType) {
      case 'DRE_MENSAL':
        return ReportTypeDomain.DRE_MENSAL;
      case 'DRE_ANUAL':
        return ReportTypeDomain.DRE_ANUAL;
      case 'VENDAS_MENSAL_POR_CLIENTE':
        return ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE;
      case 'VENDAS_MENSAL_GERAL':
        return ReportTypeDomain.VENDAS_MENSAL_GERAL;
      case 'VENDAS_ANUAL_POR_CLIENTE':
        return ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE;
      case 'VENDAS_ANUAL_GERAL':
        return ReportTypeDomain.VENDAS_ANUAL_GERAL;
      case 'ESTOQUE_MENSAL':
        return ReportTypeDomain.ESTOQUE_MENSAL;
      case 'ESTOQUE_ANUAL':
        return ReportTypeDomain.ESTOQUE_ANUAL;
      default:
        throw new Error(`Unknown report type: ${prismaType}`);
    }
  }

  static mapPrismaReportToReport(reportEntity: ReportEntity): ReportDomain {
    return {
      id: reportEntity.id,
      name: reportEntity.name,
      description: reportEntity.description,
      type: this.mapType(reportEntity.type),
      status: this.mapStatus(reportEntity.status),
      fileKey: reportEntity.fileKey,
      requestedBy: reportEntity.requestedBy,
      metadata: reportEntity.metadata as Record<string, any> | null,
      createdAt: reportEntity.createdAt,
      updatedAt: reportEntity.updatedAt,
      deletedAt: reportEntity.deletedAt,
    };
  }
}
