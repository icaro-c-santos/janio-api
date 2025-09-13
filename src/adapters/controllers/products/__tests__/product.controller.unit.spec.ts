import { Request, Response } from 'express';
import { ProductController } from '../product.controller';
import { createProductMock } from '../../../../__tests__/mocks/product.mock';
import { GetProductByIdUseCase } from '../../../../aplication/usecases/products/get-product-by-id.use.case';
import { faker } from '../../../../__tests__/mocks/faker';
import { ProductMapResponse } from '../../../../aplication/usecases/products/mappers/productToProductResponse.mapper';

describe('ProductController - getProductById', () => {
  let getProductByIdUseCase: jest.Mocked<GetProductByIdUseCase>;
  let controller: ProductController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const defaultProductId = faker.string.uuid();

  beforeEach(() => {
    getProductByIdUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new ProductController(getProductByIdUseCase);

    req = {
      params: {
        id: defaultProductId,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 when id is not a valid UUID', async () => {
    req.params = {
      id: 'invalid-uuid',
    };

    await controller.getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['id'],
            message: 'id must be a valid UUID',
          }),
        ]),
      }),
    );
    expect(getProductByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when id is undefined', async () => {
    req.params = {};

    await controller.getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when id is null', async () => {
    req.params = {
      id: null as any,
    };

    await controller.getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when id is empty string', async () => {
    req.params = {
      id: '',
    };

    await controller.getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['id'],
            message: 'id must be a valid UUID',
          }),
        ]),
      }),
    );
    expect(getProductByIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 200 when the execution is successful', async () => {
    const mockProduct = createProductMock();
    const mockResponse = ProductMapResponse.mapProductToResponse(mockProduct);

    getProductByIdUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.getProductById(req as Request, res as Response);

    expect(getProductByIdUseCase.execute).toHaveBeenCalledWith({
      id: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it('should return 400 when product is not found', async () => {
    getProductByIdUseCase.execute.mockResolvedValue({
      success: false,
      error: 'PRODUCT NOT FOUND',
    });

    await controller.getProductById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'PRODUCT NOT FOUND',
    });
  });

  it('should handle use case errors correctly', async () => {
    getProductByIdUseCase.execute.mockResolvedValue({
      success: false,
      error: 'DATABASE ERROR',
    });

    await controller.getProductById(req as Request, res as Response);

    expect(getProductByIdUseCase.execute).toHaveBeenCalledWith({
      id: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'DATABASE ERROR',
    });
  });
});
