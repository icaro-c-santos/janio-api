import { ISaleRepository } from '../../../domain/interfaces/sales.interface';
import { Result } from '../../types/result';
import { PaginatedResult } from '../shared/types';
import { SaleMapResponse } from './mappers/mapSaleToSaleResponse.mapper';
import {
  GetAllSalesInput,
  GetAllSalesResponse,
  IGetAllSalesUseCase,
} from './types';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
export class GetAllSalesUseCase implements IGetAllSalesUseCase {
  constructor(private saleRepository: ISaleRepository) {}

  async execute(
    input?: GetAllSalesInput,
  ): Promise<Result<PaginatedResult<GetAllSalesResponse>>> {
    const take = input?.pageSize ?? DEFAULT_PAGE_SIZE;
    const skip = ((input?.page ?? DEFAULT_PAGE) - 1) * take;

    const data = await this.saleRepository.getAll({
      customerId: input?.customerId,
      productId: input?.productId,
      startDate: input?.startDate,
      endDate: input?.endDate,
      skip,
      take,
    });
    const page = data.skip / data.take + 1;
    return {
      success: true,
      data: {
        pageSize: data.skip,
        total: data.total,
        page,
        items: data.items.map(SaleMapResponse.mapSaleToResponse),
      },
    };
  }
}
