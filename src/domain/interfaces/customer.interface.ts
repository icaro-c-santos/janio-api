import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from './shared/types';
import { UserDomain } from './user.interface';

export type CustomerFindAllParams = RepositoryPaginatedInput & {
  getOnlyPrimaryPhones?: boolean;
  getOnlyPrimaryAddresses?: boolean;
};
export interface ICustomerRepository {
  findById(id: string): Promise<CustomerDomain | null>;
  findAll(
    filter: CustomerFindAllParams,
  ): Promise<RepositoryPaginatedResult<CustomerDomain>>;
}

export interface CustomerDomain {
  userId: string;
  user: UserDomain;
  deletedAt: Date | null;
}
