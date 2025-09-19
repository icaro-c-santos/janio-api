import { PrismaClient } from '@prisma/client';
import {
  ISaleRepository,
  CreateSaleData,
  SaleDomain,
  GetSalesFilter,
} from '../../../domain/interfaces/sales.interface';
import { RepositoryPaginatedResult } from '../../../domain/interfaces/shared/types';
import { SaleRepositoryMap } from './mappers/mapPrismaSaleToSale.mapper';

export class SaleRepository implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

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
