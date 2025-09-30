import { ReportDomain } from '../../domain/report.interface';
import {
  GetAllReportsResponse,
  GetReportByIdResponse,
  CreateReportResponse,
} from '../types';

export class ReportMapResponse {
  public static mapReportToGetAllResponse(
    report: ReportDomain,
  ): GetAllReportsResponse {
    return {
      id: report.id,
      name: report.name,
      description: report.description,
      type: report.type,
      status: report.status,
      fileKey: report.fileKey,
      requestedBy: report.requestedBy,
      metadata: report.metadata,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  public static mapReportToGetByIdResponse(
    report: ReportDomain,
  ): GetReportByIdResponse {
    return {
      id: report.id,
      name: report.name,
      description: report.description,
      type: report.type,
      status: report.status,
      fileKey: report.fileKey,
      requestedBy: report.requestedBy,
      metadata: report.metadata,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }

  public static mapReportToCreateResponse(
    report: ReportDomain,
  ): CreateReportResponse {
    return {
      id: report.id,
      name: report.name,
      description: report.description,
      type: report.type,
      status: report.status,
      fileKey: report.fileKey,
      requestedBy: report.requestedBy,
      metadata: report.metadata,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  }
}
