import { faker } from '../../../../__tests__/mocks/faker';
import { createProductMock } from '../../../../__tests__/mocks/product.mock';
import { IProductRepository } from '../../../../domain/interfaces/product.interface';
import { GetProductByIdUseCase } from '../get-product-by-id.use.case';
import { ProductMapResponse } from '../mappers/productToProductResponse.mapper';
import { GetProductByIdInput } from '../types';

describe('ProductUseCase', () => {
  let productRepository: jest.Mocked<IProductRepository>;
  let getProductByIdUseCase: GetProductByIdUseCase;
  const defaultInput: GetProductByIdInput = {
    id: faker.string.uuid(),
  };
  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
    } as any;

    getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  });

  it('should return a product', async () => {
    const mockProduct = createProductMock({
      id: defaultInput.id,
    });
    productRepository.findById.mockResolvedValueOnce(mockProduct);
    const result = (await getProductByIdUseCase.execute(defaultInput)) as any;

    expect(result.success).toBe(true);
    expect(result.data).toEqual(
      ProductMapResponse.mapProductToResponse(mockProduct),
    );
    expect(productRepository.findById).toHaveBeenCalledWith(defaultInput.id);
  });

  it('should return an erro when product not exists', async () => {
    productRepository.findById.mockResolvedValueOnce(null);
    const result = (await getProductByIdUseCase.execute(defaultInput)) as any;

    expect(result.success).toBe(false);
    expect(result.error).toBe('PRODUCT NOT FOUND');
    expect(productRepository.findById).toHaveBeenCalledWith(defaultInput.id);
  });
});
