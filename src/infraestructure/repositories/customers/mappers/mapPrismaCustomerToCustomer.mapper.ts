import {
  Customer as CustomerEntity,
  Company as CompanyEntity,
  Individual as IndividualEntity,
  User as UserEntity,
  Address as AddressEntity,
  Phone as PhoneEntity,
} from '@prisma/client';
import { CustomerDomain } from '../../../../domain/interfaces/customer.interface';
import { UserRepositoryMap } from '../../shared/mappers/mapPrismaUserToUser.mapper';

export class CustomerRepositoryMap {
  public static mapPrismaCustomerToCustomer(
    customerEntity: CustomerEntity & {
      user: UserEntity & {
        individual?: IndividualEntity | null;
        company?: CompanyEntity | null;
        addresses: AddressEntity[];
        phones: PhoneEntity[];
      };
    },
  ): CustomerDomain {
    return {
      userId: customerEntity.userId,
      deletedAt: customerEntity.deletedAt,
      user: UserRepositoryMap.mapPrismaUserToUser({
        ...customerEntity.user,
        individual: customerEntity.user.individual ?? undefined,
        company: customerEntity.user.company ?? undefined,
      }),
    };
  }
}
