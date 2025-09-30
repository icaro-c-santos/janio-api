import {
  IReportRepository,
  ReportStatusDomain,
  ReportTypeDomain,
} from '../domain/report.interface';
import {
  ICreateReportUseCase,
  CreateReportInput,
  CreateReportResponse,
} from './types';
import { ReportMapResponse } from './mappers/reportToResponse.mapper';

export class CreateReportUseCase implements ICreateReportUseCase {
  constructor(private reportRepository: IReportRepository) {}

  async execute(input: CreateReportInput): Promise<CreateReportResponse> {
    const metadata = this.buildMetadata(input);

    const report = await this.reportRepository.create({
      name: input.name,
      description: input.description,
      type: input.type,
      requestedBy: input.requestedBy,
      metadata,
      status: ReportStatusDomain.PENDING,
    });

    return ReportMapResponse.mapReportToCreateResponse(report);
  }

  private buildMetadata(
    input: CreateReportInput,
  ): Record<string, any> | undefined {
    const customerSpecificTypes = [
      ReportTypeDomain.VENDAS_MENSAL_POR_CLIENTE,
      ReportTypeDomain.VENDAS_ANUAL_POR_CLIENTE,
    ];

    if (customerSpecificTypes.includes(input.type)) {
      return {
        customerId: input.customerId,
        productId: input.productId,
      };
    }

    return undefined;
  }
}
