import {
  ReportTypeDomain,
  ReportStatusDomain,
} from '../../domain/report.interface';

export interface ReportTypeInfo {
  value: ReportTypeDomain;
  label: string;
  description: string;
}

export interface ReportStatusInfo {
  value: ReportStatusDomain;
  label: string;
  description: string;
}

export interface GetReportTypesResponse {
  types: ReportTypeInfo[];
  statuses: ReportStatusInfo[];
}

export interface IGetReportTypesUseCase {
  execute(): Promise<GetReportTypesResponse>;
}


