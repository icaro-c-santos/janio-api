import { IStorageService } from '../../../domain/interfaces/storage.interface';
import {
  CheckReadinessUseCaseResponse,
  ReadinessStatus,
  Service,
} from './types';

export class CheckReadinessUseCase {
  constructor(private storageService: IStorageService) {}

  async execute(): Promise<CheckReadinessUseCaseResponse> {
    try {
      const servicesOn: string[] = [];
      const servicesDown: string[] = [];
      const gcpHealthy = await this.storageService.ping();
      if (gcpHealthy) {
        servicesOn.push(Service.STORAGE);
      } else {
        servicesDown.push(Service.STORAGE);
      }
      return {
        status:
          servicesDown.length === 0
            ? ReadinessStatus.READY
            : ReadinessStatus.UNREADY,
        servicesDown,
        servicesOn,
      };
    } catch {
      return {
        status: ReadinessStatus.UNREADY,
        servicesDown: [],
        servicesOn: [],
      };
    }
  }
}
