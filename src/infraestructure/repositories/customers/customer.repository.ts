import { PrismaClient } from '@prisma/client';
import {
  CreateCustomerData,
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
    const { skip, take, email, cpf, cnpj } = filter;

    const whereConditions: any = { deletedAt: null };

    if (email || cpf || cnpj) {
      whereConditions.user = {
        deletedAt: null,
      };

      if (email) {
        whereConditions.user.email = email;
      }

      if (cpf) {
        whereConditions.user.individual = {
          cpf,
          deletedAt: null,
        };
      }

      if (cnpj) {
        whereConditions.user.company = {
          cnpj,
          deletedAt: null,
        };
      }
    }

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
        where: whereConditions,
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
        where: whereConditions,
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

  async create(customer: CreateCustomerData) {
    const newCustomer = await this.prisma.customer.create({
      data: {
        user: {
          create: {
            type: customer.user.type,
            email: customer.user.email,
            individual: customer.user.individual
              ? {
                  create: {
                    cpf: customer.user.individual.cpf,
                    fullName: customer.user.individual.fullName,
                    birthDate: customer.user.individual.birthDate,
                  },
                }
              : undefined,
            company: customer.user.company
              ? {
                  create: {
                    cnpj: customer.user.company.cnpj,
                    legalName: customer.user.company.legalName,
                    tradeName: customer.user.company.tradeName,
                    stateRegistration: customer.user.company.stateRegistration,
                  },
                }
              : undefined,
            addresses: {
              create: {
                street: customer.user.address.street,
                number: customer.user.address.number,
                district: customer.user.address.district,
                city: customer.user.address.city,
                state: customer.user.address.state,
                postalCode: customer.user.address.postalCode,
                country: customer.user.address.country,
                isPrimary: customer.user.address.isPrimary,
              },
            },
            phones: {
              create: {
                areaCode: customer.user.phone.areaCode,
                number: customer.user.phone.number,
                isPrimary: customer.user.phone.isPrimary,
                isWhatsapp: customer.user.phone.isWhatsapp,
                type: customer.user.phone.type,
              },
            },
          },
        },
      },
      include: defaultInclude,
    });
    return CustomerRepositoryMap.mapPrismaCustomerToCustomer(newCustomer);
  }
}
