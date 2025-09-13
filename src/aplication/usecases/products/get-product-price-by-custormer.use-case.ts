import { IProductRepository } from '../../../domain/interfaces/product.interface';
import { Result } from '../../types/result';
import {
  GetProductPriceByCustomerIdInput,
  GetProductPriceByCustomerIdResponse,
  IGetProductPriceByCustomerIdUseCase,
} from './types';

export class GetProductPriceByCustomerIdUseCase
  implements IGetProductPriceByCustomerIdUseCase
{
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    input: GetProductPriceByCustomerIdInput,
  ): Promise<Result<GetProductPriceByCustomerIdResponse>> {
    const data = await this.productRepository.getProductPriceByCustomerId({
      customerId: input.customerId,
      productId: input.productId,
    });

    if (data == null) {
      return {
        success: false,
        error: 'PRICE NOT FOUND',
      };
    }

    return {
      success: true,
      data: {
        price: data,
      },
    };
  }
}
