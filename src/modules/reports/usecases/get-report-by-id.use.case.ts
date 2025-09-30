import { IReportRepository } from '../domain/report.interface';
import {
  IGetReportByIdUseCase,
  GetReportByIdInput,
  GetReportByIdResponse,
} from './types';
import { ReportMapResponse } from './mappers/reportToResponse.mapper';

export class GetReportByIdUseCase implements IGetReportByIdUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(input: GetReportByIdInput): Promise<GetReportByIdResponse> {
    const report = await this.reportRepository.findById(input.id);

    if (!report) throw new Error('Report not found');

    return ReportMapResponse.mapReportToGetByIdResponse(report);
  }
}
