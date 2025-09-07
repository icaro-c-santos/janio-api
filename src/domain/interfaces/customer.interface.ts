import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from './shared/types';
import { User } from './user.interface';

export type CustomerFindAllParams = RepositoryPaginatedInput & {
  getOnlyPrimaryPhones?: boolean;
  getOnlyPrimaryAddresses?: boolean;
};
export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findAll(
    filter: CustomerFindAllParams,
  ): Promise<RepositoryPaginatedResult<Customer>>;
}

export interface Customer {
  userId: string;
  user: User;
  deletedAt: Date | null;
}
