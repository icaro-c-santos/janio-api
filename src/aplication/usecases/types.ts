export enum ReadinessStatus {
  'READY' = 'ready',
  'UNREADY' = 'unready',
}
export interface CheckReadinessUseCaseResponse {
  status: ReadinessStatus;
  servicesOn: string[];
  servicesDown: string[];
}

export enum Service {
  STORAGE = 'STORAGE SERVICE',
}
