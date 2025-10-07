import { IReportTypesRepository } from '../repository/report-types.repository';
import {
  IGetReportTypesUseCase,
  GetReportTypesResponse,
} from './types/getReportTypes.types';

export class GetReportTypesUseCase implements IGetReportTypesUseCase {
  constructor(private reportTypesRepository: IReportTypesRepository) {}

  async execute(): Promise<GetReportTypesResponse> {
    return this.reportTypesRepository.getReportTypes();
  }
}

