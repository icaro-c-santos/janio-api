import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from '../../shared/types/repository';

export type ReportFindAllParams = RepositoryPaginatedInput & {
  name?: string;
  type?: ReportTypeDomain;
  status?: ReportStatusDomain;
};

export enum ReportStatusDomain {
  PROCESSING = 'PROCESSING',
  PENDING = 'PENDING',
  READY = 'READY',
  FAILED = 'FAILED',
}

export enum ReportTypeDomain {
  DRE_MENSAL = 'DRE_MENSAL',
  DRE_ANUAL = 'DRE_ANUAL',
  VENDAS_MENSAL_POR_CLIENTE = 'VENDAS_MENSAL_POR_CLIENTE',
  VENDAS_MENSAL_GERAL = 'VENDAS_MENSAL_GERAL',
  VENDAS_ANUAL_POR_CLIENTE = 'VENDAS_ANUAL_POR_CLIENTE',
  VENDAS_ANUAL_GERAL = 'VENDAS_ANUAL_GERAL',
  ESTOQUE_MENSAL = 'ESTOQUE_MENSAL',
  ESTOQUE_ANUAL = 'ESTOQUE_ANUAL',
}

export type CreateReportData = {
  name: string;
  description?: string;
  type: ReportTypeDomain;
  requestedBy?: string;
  metadata?: Record<string, any>;
  status: ReportStatusDomain;
};

export type UpdateReportData = {
  name?: string;
  description?: string;
  status?: ReportStatusDomain;
  fileKey?: string;
  metadata?: Record<string, any>;
};

export interface IReportRepository {
  findById(id: string): Promise<ReportDomain | null>;
  findAll(
    filter: ReportFindAllParams,
  ): Promise<RepositoryPaginatedResult<ReportDomain>>;
  create(report: CreateReportData): Promise<ReportDomain>;
  update(id: string, data: UpdateReportData): Promise<ReportDomain>;
  delete(id: string): Promise<void>;
}

export interface ReportDomain {
  id: string;
  name: string;
  description: string | null;
  type: ReportTypeDomain;
  status: ReportStatusDomain;
  fileKey: string | null;
  requestedBy: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
