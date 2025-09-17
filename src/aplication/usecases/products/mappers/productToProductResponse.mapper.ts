import { ProductDomain } from '../../../../domain/interfaces/product.interface';
import { GetProductByIdResponse } from '../types';

export class ProductMapResponse {
  public static mapProductToResponse(
    product: ProductDomain,
  ): GetProductByIdResponse {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
      description: product?.description || null,
    };
  }
}
