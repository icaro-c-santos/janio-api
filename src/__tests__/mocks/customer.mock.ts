import { CustomerDomain } from '../../domain/interfaces/customer.interface';
import { UserDomain } from '../../domain/interfaces/user.interface';
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
