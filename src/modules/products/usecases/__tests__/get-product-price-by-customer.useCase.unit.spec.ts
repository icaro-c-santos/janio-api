import { faker } from '../../../../__tests__/mocks/faker';
import { IProductRepository } from '../../domain/product.interface';
import { GetProductPriceByCustomerIdUseCase } from '../get-product-price-by-custormer.use-case';
import { GetProductPriceByCustomerIdInput } from '../types';

describe('GetProductPriceByCustomerIdUseCase', () => {
  let productRepository: jest.Mocked<IProductRepository>;
  let getProductPriceByCustomerIdUseCase: GetProductPriceByCustomerIdUseCase;
  const defaultInput: GetProductPriceByCustomerIdInput = {
    customerId: faker.string.uuid(),
    productId: faker.string.uuid(),
  };

  beforeEach(() => {
    productRepository = {
      getProductPriceByCustomerId: jest.fn(),
    } as any;

    getProductPriceByCustomerIdUseCase = new GetProductPriceByCustomerIdUseCase(
      productRepository,
    );
  });

  it('should return a product price for customer', async () => {
    const mockPrice = faker.number.int({ min: 10, max: 1000 });
    productRepository.getProductPriceByCustomerId.mockResolvedValueOnce(
      mockPrice,
    );

    const result = (await getProductPriceByCustomerIdUseCase.execute(
      defaultInput,
    )) as any;

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ price: mockPrice });
    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: defaultInput.customerId,
      productId: defaultInput.productId,
    });
  });

  it('should return an error when price not found', async () => {
    productRepository.getProductPriceByCustomerId.mockResolvedValueOnce(null);

    const result = (await getProductPriceByCustomerIdUseCase.execute(
      defaultInput,
    )) as any;

    expect(result.success).toBe(false);
    expect(result.error).toBe('PRICE NOT FOUND');
    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: defaultInput.customerId,
      productId: defaultInput.productId,
    });
  });

  it('should handle zero price correctly', async () => {
    const mockPrice = 0;
    productRepository.getProductPriceByCustomerId.mockResolvedValueOnce(
      mockPrice,
    );

    const result = (await getProductPriceByCustomerIdUseCase.execute(
      defaultInput,
    )) as any;

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ price: mockPrice });
    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: defaultInput.customerId,
      productId: defaultInput.productId,
    });
  });

  it('should handle decimal price correctly', async () => {
    const mockPrice = 99.99;
    productRepository.getProductPriceByCustomerId.mockResolvedValueOnce(
      mockPrice,
    );

    const result = (await getProductPriceByCustomerIdUseCase.execute(
      defaultInput,
    )) as any;

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ price: mockPrice });
    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: defaultInput.customerId,
      productId: defaultInput.productId,
    });
  });

  it('should handle repository errors correctly', async () => {
    const repositoryError = new Error('Database connection failed');
    productRepository.getProductPriceByCustomerId.mockRejectedValueOnce(
      repositoryError,
    );

    await expect(
      getProductPriceByCustomerIdUseCase.execute(defaultInput),
    ).rejects.toThrow('Database connection failed');

    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: defaultInput.customerId,
      productId: defaultInput.productId,
    });
  });

  it('should call repository with correct parameters', async () => {
    const customInput: GetProductPriceByCustomerIdInput = {
      customerId: 'custom-customer-id',
      productId: 'custom-product-id',
    };

    const mockPrice = faker.number.int({ min: 10, max: 1000 });
    productRepository.getProductPriceByCustomerId.mockResolvedValueOnce(
      mockPrice,
    );

    await getProductPriceByCustomerIdUseCase.execute(customInput);

    expect(productRepository.getProductPriceByCustomerId).toHaveBeenCalledWith({
      customerId: customInput.customerId,
      productId: customInput.productId,
    });
  });
});
