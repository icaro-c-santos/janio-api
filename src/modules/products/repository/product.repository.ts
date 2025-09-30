import { PrismaClient } from '@prisma/client';
import { IProductRepository, ProductDomain } from '../domain/product.interface';
import { ProductRepositoryMap } from './mappers/mapPrismaProductToProduct.mapper';

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<ProductDomain | null> {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
    return product
      ? ProductRepositoryMap.mapPrismaProductToProduct(product)
      : null;
  }

  async findAll(): Promise<ProductDomain[]> {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
    return products.map((product) =>
      ProductRepositoryMap.mapPrismaProductToProduct(product),
    );
  }

  async getProductPriceByCustomerId({
    customerId,
    productId,
  }: {
    customerId: string;
    productId: string;
  }): Promise<number | null> {
    const data = await this.prisma.customerProductPrice.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    });

    if (!data) return null;

    return Number(data.price);
  }
}
