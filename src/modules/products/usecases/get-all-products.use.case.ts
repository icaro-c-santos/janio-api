import { IProductRepository } from '../domain/product.interface';

export interface IGetAllProductsUseCase {
  execute(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }>;
}

export class GetAllProductsUseCase implements IGetAllProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(): Promise<{
    success: boolean;
    data?: any[];
    error?: string;
  }> {
    try {
      const products = await this.productRepository.findAll();

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Erro ao buscar produtos',
      };
    }
  }
}
