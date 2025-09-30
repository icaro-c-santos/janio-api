import {
  IReportRepository,
  ReportStatusDomain,
} from '../domain/report.interface';
import {
  IDownloadReportUseCase,
  DownloadReportInput,
  DownloadReportResponse,
} from './types/downloadReport.types';
import { IStorageService } from '../../users/domain/storage.interface';

export class DownloadReportUseCase implements IDownloadReportUseCase {
  constructor(
    private reportRepository: IReportRepository,
    private storageService: IStorageService,
  ) {}

  async execute(input: DownloadReportInput): Promise<DownloadReportResponse> {
    const report = await this.reportRepository.findById(input.id);

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.status !== ReportStatusDomain.READY) {
      throw new Error('Report is not ready for download');
    }

    if (!report.fileKey) {
      throw new Error('Report file not found');
    }

    const expiresInSeconds = 3600;
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    const downloadUrl = await this.storageService.generateDownloadUrl({
      path: report.fileKey,
      expiresInSeconds,
    });

    const fileName = this.generateFileName(report);

    return {
      downloadUrl,
      fileName,
      expiresAt,
    };
  }

  private generateFileName(report: any): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const typeMap: Record<string, string> = {
      DRE_MENSAL: 'DRE_Mensal',
      DRE_ANUAL: 'DRE_Anual',
      VENDAS_MENSAL_POR_CLIENTE: 'Vendas_Mensal_Cliente',
      VENDAS_MENSAL_GERAL: 'Vendas_Mensal_Geral',
      VENDAS_ANUAL_POR_CLIENTE: 'Vendas_Anual_Cliente',
      VENDAS_ANUAL_GERAL: 'Vendas_Anual_Geral',
      ESTOQUE_MENSAL: 'Estoque_Mensal',
      ESTOQUE_ANUAL: 'Estoque_Anual',
    };

    const typeName = typeMap[report.type] || 'Report';
    return `${typeName}_${timestamp}.pdf`;
  }
}
