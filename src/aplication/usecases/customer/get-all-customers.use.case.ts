import { ICustomerRepository } from '../../../domain/interfaces/customer.interface';
import { Result } from '../../types/result';
import { PaginatedResult } from '../shared/types';
import { CustomerMapResponse } from './mappers/customerToCustomeResponse.mapper';
import {
  GetAllCustomersInput,
  GetAllCustomersResponse,
  IGetAllCustomersUseCase,
} from './types';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
export class GetAllCustomersUseCase implements IGetAllCustomersUseCase {
  constructor(private customerRepository: ICustomerRepository) {}

  async execute(
    input: GetAllCustomersInput,
  ): Promise<Result<PaginatedResult<GetAllCustomersResponse>>> {
    const take = input?.pageSize ?? DEFAULT_PAGE_SIZE;
    const skip = ((input?.page ?? DEFAULT_PAGE) - 1) * take;

    const data = await this.customerRepository.findAll({
      skip,
      take,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
    });
    const page = data.skip / data.take + 1;

    return {
      success: true,
      data: {
        page,
        pageSize: data.take,
        items: data.items.map((customer) =>
          CustomerMapResponse.mapCustomerToResponse(customer),
        ),
        total: data.total,
      },
    };
  }
}
