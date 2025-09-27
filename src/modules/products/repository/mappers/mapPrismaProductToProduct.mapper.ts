import { Product as ProductEntity } from '@prisma/client';
import { ProductDomain } from '../../domain/product.interface';

export class ProductRepositoryMap {
  public static mapPrismaProductToProduct(
    productEntity: ProductEntity,
  ): ProductDomain {
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
