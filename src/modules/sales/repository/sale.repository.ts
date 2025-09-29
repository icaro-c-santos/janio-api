import { PrismaClient } from '@prisma/client';
import { SaleRepositoryMap } from './mappers/mapPrismaSaleToSale.mapper';
import {
  SaleDomain,
  ISaleRepository,
  CreateSaleData,
  GetSalesFilter,
} from '../domain/sales.interface';
import { RepositoryPaginatedResult } from '../../shared/types/repository';

export class SaleRepository implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

  withTransaction(tx: PrismaClient): ISaleRepository {
    return new SaleRepository(tx);
  }

  async create(saleData: CreateSaleData): Promise<SaleDomain> {
    const sale = await this.prisma.sale.create({
      data: {
        productId: saleData.productId,
        customerId: saleData.customerId,
        quantity: saleData.quantity,
        unitPrice: saleData.unitPrice,
        totalPrice: saleData.totalPrice,
        receiptFileKey: saleData.receiptFileKey,
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
                phones: true,
                addresses: true,
              },
            },
          },
        },
      },
    });

    return SaleRepositoryMap.mapPrismaSaleToSale(sale);
  }

  async findById(id: string): Promise<SaleDomain | null> {
    const sale = await this.prisma.sale.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        product: true,
        customer: {
          include: {
            user: {
              include: {
                addresses: true,
                phones: true,
                individual: true,
                company: true,
              },
            },
          },
        },
      },
    });

    if (!sale) {
      return null;
    }

    return SaleRepositoryMap.mapPrismaSaleToSale(sale);
  }

  async getAll(
    filter: GetSalesFilter,
  ): Promise<RepositoryPaginatedResult<SaleDomain>> {
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
                  addresses: true,
                  phones: true,
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
      items: sales.map((sale) => SaleRepositoryMap.mapPrismaSaleToSale(sale)),
    };
  }
}
