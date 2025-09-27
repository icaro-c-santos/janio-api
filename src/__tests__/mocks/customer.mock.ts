import { CustomerDomain } from '../../modules/customers/domain/customer.interface';
import { UserDomain } from '../../modules/users/domain/user.interface';
import { createUserMock } from './user.mock';

export function createCustomerMock(options?: {
  deletedAt: Date | null;
  user: UserDomain;
}): CustomerDomain {
  const user = options?.user ?? createUserMock();

  return {
    deletedAt: options?.deletedAt ?? null,
    userId: user.id,
    user,
  };
}
