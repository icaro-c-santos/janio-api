import { PrismaClient } from '@prisma/client';
import {
  CustomerFindAllParams,
  ICustomerRepository,
} from '../../../domain/interfaces/customer.interface';
import { CustomerRepositoryMap } from './mappers/mapPrismaCustomerToCustomer.mapper';

const defaultInclude = {
  user: {
    include: {
      individual: {
        where: {
          deletedAt: null,
        },
      },
      company: {
        where: {
          deletedAt: null,
        },
      },
      addresses: true,
      phones: true,
    },
  },
};
export class CustomerRepository implements ICustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: id, deletedAt: null },
      include: defaultInclude,
    });
    if (customer)
      return CustomerRepositoryMap.mapPrismaCustomerToCustomer(customer);

    return null;
  }

  async findAll(filter: CustomerFindAllParams) {
    const { skip, take } = filter;

    const addressesQuery = filter.getOnlyPrimaryAddresses
      ? {
          where: {
            isPrimary: true,
          },
          take: 1,
        }
      : true;

    const phonesQuery = filter.getOnlyPrimaryPhones
      ? {
          where: {
            isPrimary: true,
          },
          take: 1,
        }
      : true;
    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: { deletedAt: null },
        include: {
          user: {
            include: {
              individual: {
                where: {
                  deletedAt: null,
                },
              },
              company: {
                where: {
                  deletedAt: null,
                },
              },
              addresses: addressesQuery,
              phones: phonesQuery,
            },
          },
        },
        skip,
        take,
      }),
      this.prisma.customer.count({
        where: { deletedAt: null },
      }),
    ]);
    return {
      total,
      take,
      skip,
      items: items.map((customer) =>
        CustomerRepositoryMap.mapPrismaCustomerToCustomer(customer),
      ),
    };
  }
}
