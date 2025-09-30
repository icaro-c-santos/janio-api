export interface DownloadReportInput {
  id: string;
}

export interface DownloadReportResponse {
  downloadUrl: string;
  fileName: string;
  expiresAt: Date;
}

export interface IDownloadReportUseCase {
  execute(input: DownloadReportInput): Promise<DownloadReportResponse>;
}
