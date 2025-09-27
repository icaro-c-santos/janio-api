import { Result } from '../../shared/types/result';
import { PaginatedResult } from '../../shared/types/pagination';
import { ICustomerRepository } from '../domain/customer.interface';
import { CustomerMapResponse } from './mappers/customerToCustomeResponse.mapper';
import {
  IGetAllCustomersUseCase,
  GetAllCustomersInput,
  GetAllCustomersResponse,
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
