import { Customer } from '../../domain/interfaces/customer.interface';
import { User } from '../../domain/interfaces/user.interface';
import { createUserMock } from './user.mock';

export function createCustomerMock(options?: {
  deletedAt: Date | null;
  user: User;
}): Customer {
  const user = options?.user ?? createUserMock();

  return {
    deletedAt: options?.deletedAt ?? null,
    userId: user.id,
    user,
  };
}
