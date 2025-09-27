import { Result } from '../../shared/types/result';
import { IProductRepository } from '../domain/product.interface';

import { ProductMapResponse } from './mappers/productToProductResponse.mapper';
import {
  GetProductByIdInput,
  GetProductByIdResponse,
  IGetProductByIdUseCase,
} from './types';

export class GetProductByIdUseCase implements IGetProductByIdUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    input: GetProductByIdInput,
  ): Promise<Result<GetProductByIdResponse>> {
    const data = await this.productRepository.findById(input.id);

    if (!data) {
      return {
        success: false,
        error: 'PRODUCT NOT FOUND',
      };
    }
    return {
      success: true,
      data: ProductMapResponse.mapProductToResponse(data),
    };
  }
}
