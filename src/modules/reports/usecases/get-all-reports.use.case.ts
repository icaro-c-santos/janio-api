import { PaginatedResult } from '../../shared/types/pagination';
import { IReportRepository } from '../domain/report.interface';
import {
  IGetAllReportsUseCase,
  GetAllReportsInput,
  GetAllReportsResponse,
} from './types';
import { ReportMapResponse } from './mappers/reportToResponse.mapper';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

export class GetAllReportsUseCase implements IGetAllReportsUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(
    input: GetAllReportsInput,
  ): Promise<PaginatedResult<GetAllReportsResponse>> {
    const take = input?.pageSize ?? DEFAULT_PAGE_SIZE;
    const skip = ((input?.page ?? DEFAULT_PAGE) - 1) * take;

    const data = await this.reportRepository.findAll({
      skip,
      take,
      name: input.name,
      type: input.type,
      status: input.status,
    });

    const page = data.skip / data.take + 1;

    return {
      page,
      pageSize: data.take,
      items: data.items.map((report) =>
        ReportMapResponse.mapReportToGetAllResponse(report),
      ),
      total: data.total,
    };
  }
}
