import { PrismaClient, Product as ProductEntity } from '@prisma/client';
import {
  IProductRepository,
  Product,
} from '../../domain/interfaces/product.interface';

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
    return product
      ? ProductRepository.mapPrismaProductToProduct(product)
      : null;
  }

  private static mapPrismaProductToProduct(
    productEntity: ProductEntity,
  ): Product {
    return {
      id: productEntity.id,
      name: productEntity.name,
      price: Number(productEntity.price),
      createdAt: productEntity.createdAt,
      updatedAt: productEntity.updatedAt,
      deletedAt: productEntity.deletedAt,
      description: productEntity.description,
    };
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
