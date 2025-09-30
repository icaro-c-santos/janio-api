/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  PaginatedResult,
  PaginatedUseCase,
} from '../../shared/types/pagination';
import {
  ReportStatusDomain,
  ReportTypeDomain,
} from '../domain/report.interface';

export interface GetAllReportsInput extends PaginatedUseCase {
  name?: string;
  type?: ReportTypeDomain;
  status?: ReportStatusDomain;
}

export interface GetAllReportsResponse {
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
}

export interface IGetAllReportsUseCase {
  execute(
    input: GetAllReportsInput,
  ): Promise<PaginatedResult<GetAllReportsResponse>>;
}

export interface GetReportByIdInput {
  id: string;
}

export interface GetReportByIdResponse extends GetAllReportsResponse {}

export interface IGetReportByIdUseCase {
  execute(input: GetReportByIdInput): Promise<GetReportByIdResponse>;
}

export interface CreateReportInput {
  name: string;
  description?: string;
  type: ReportTypeDomain;
  requestedBy?: string;
  customerId?: string;
  productId?: string;
}

export interface CreateReportResponse {
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
}

export interface ICreateReportUseCase {
  execute(input: CreateReportInput): Promise<CreateReportResponse>;
}
