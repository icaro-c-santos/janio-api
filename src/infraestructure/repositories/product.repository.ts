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
}
