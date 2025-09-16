import {
  PrismaClient,
  Product as ProductEntity,
  Sale as SaleEntity,
  Customer as CustomerEntity,
  User as UserEntity,
  Individual as IndividualEntity,
  Company as CompanyEntity,
} from '@prisma/client';
import {
  ISaleRepository,
  CreateSaleData,
  Sale,
  GetSalesFilter,
} from '../../domain/interfaces/sales.interface';
import { RepositoryPaginatedResult } from '../../domain/interfaces/shared/types';

export class SaleRepository implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

  async create(saleData: CreateSaleData): Promise<Sale> {
    const sale = await this.prisma.sale.create({
      data: {
        productId: saleData.productId,
        customerId: saleData.customerId,
        quantity: saleData.quantity,
        unitPrice: saleData.unitPrice,
        totalPrice: saleData.totalPrice,
        receiptUrl: saleData.receiptUrl,
        saleDate: new Date(),
      },
      include: {
        product: true,
        customer: {
          include: {
            user: {
              include: {
                individual: true,
                company: true,
              },
            },
          },
        },
      },
    });

    return SaleRepository.mapPrismaSaleToSale(sale);
  }

  async getAll(
    filter: GetSalesFilter,
  ): Promise<RepositoryPaginatedResult<Sale>> {
    const { skip, take } = filter;

    const where = {
      deletedAt: null,
      customerId: filter?.customerId,
      productId: filter?.productId,
    };

    if (filter?.startDate || filter?.endDate) {
      Object.assign(where, {
        saleDate: {
          gte: filter?.startDate,
          lte: filter?.endDate,
        },
      });
    }

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: {
          product: true,
          customer: {
            include: {
              user: {
                include: {
                  individual: true,
                  company: true,
                },
              },
            },
          },
        },
        skip,
        take,
      }),
      this.prisma.sale.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);
    return {
      total,
      skip,
      take,
      items: sales.map((sale) => SaleRepository.mapPrismaSaleToSale(sale)),
    };
  }

  private static mapPrismaSaleToSale(
    saleEntity: SaleEntity & {
      product: ProductEntity;
      customer: CustomerEntity & {
        user: UserEntity & {
          individual: IndividualEntity;
          company: CompanyEntity;
        };
      };
    },
  ): Sale {
    return {
      id: saleEntity.id,
      productId: saleEntity.productId,
      customerId: saleEntity.customerId,
      quantity: saleEntity.quantity,
      unitPrice: Number(saleEntity.unitPrice),
      totalPrice: Number(saleEntity.totalPrice),
      saleDate: saleEntity.saleDate,
      receiptUrl: saleEntity.receiptUrl,
      product: {
        id: saleEntity.product.id,
        name: saleEntity.product.name,
        description: saleEntity.product.description,
        price: saleEntity.product.price
          ? Number(saleEntity.product.price)
          : undefined,
      },
      customer: {
        userId: saleEntity.customer.userId,
        user: SaleRepository.mapUser(saleEntity.customer.user),
      },
    };
  }

  private static mapUser(
    user: UserEntity & {
      individual?: IndividualEntity | null;
      company?: CompanyEntity | null;
    },
  ) {
    return {
      id: user.id,
      type: user.type,
      email: user.email || undefined,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      individual: user.individual
        ? SaleRepository.mapIndividual(user.individual)
        : undefined,
      company: user.company
        ? SaleRepository.mapCompany(user.company)
        : undefined,
    };
  }

  private static mapIndividual(individual: IndividualEntity) {
    return {
      cpf: individual.cpf,
      fullName: individual.fullName,
      birthDate: individual.birthDate || undefined,
      deletedAt: individual.deletedAt,
    };
  }

  private static mapCompany(company: CompanyEntity) {
    return {
      cnpj: company.cnpj,
      legalName: company.legalName,
      tradeName: company.tradeName || undefined,
      stateRegistration: company.stateRegistration || undefined,
      deletedAt: company.deletedAt,
    };
  }
}
