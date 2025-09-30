export interface ReportStrategyResult {
  fileKey: string;
  metadata?: Record<string, any>;
}

export interface IReportStrategy {
  execute(metadata?: Record<string, any> | null): Promise<ReportStrategyResult>;
}
