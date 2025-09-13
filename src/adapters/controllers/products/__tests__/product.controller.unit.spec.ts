import { Request, Response } from 'express';
import { ProductController } from '../product.controller';
import { createProductMock } from '../../../../__tests__/mocks/product.mock';
import { faker } from '../../../../__tests__/mocks/faker';
import { ProductMapResponse } from '../../../../aplication/usecases/products/mappers/productToProductResponse.mapper';
import {
  IGetProductByIdUseCase,
  IGetProductPriceByCustomerIdUseCase,
} from '../../../../aplication/usecases/products/types';

describe('ProductController - getProductById', () => {
  let getProductByIdUseCase: jest.Mocked<IGetProductByIdUseCase>;
  let controller: ProductController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const defaultProductId = faker.string.uuid();

  beforeEach(() => {
    getProductByIdUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new ProductController(getProductByIdUseCase, null as any);

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
      productId: 'invalid-uuid',
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
      productId: null as any,
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
      productId: '',
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

describe('ProductController - getProductPriceByCustomer', () => {
  let getProductPriceByCustomerIdUseCase: jest.Mocked<IGetProductPriceByCustomerIdUseCase>;
  let controller: ProductController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const defaultCustomerId = faker.string.uuid();
  const defaultProductId = faker.string.uuid();

  beforeEach(() => {
    getProductPriceByCustomerIdUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new ProductController(
      null as any,
      getProductPriceByCustomerIdUseCase,
    );

    req = {
      params: {
        customerId: defaultCustomerId,
        productId: defaultProductId,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 when customerId is not a valid UUID', async () => {
    req.params = {
      customerId: 'invalid-uuid',
      productId: defaultProductId,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['customerId'],
            message: 'customerId must be a valid UUID',
          }),
        ]),
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when productId is not a valid UUID', async () => {
    req.params = {
      customerId: defaultCustomerId,
      productId: 'invalid-uuid',
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['productId'],
            message: 'productId must be a valid UUID',
          }),
        ]),
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when customerId is undefined', async () => {
    req.params = {
      productId: defaultProductId,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when productId is undefined', async () => {
    req.params = {
      customerId: defaultCustomerId,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when customerId is null', async () => {
    req.params = {
      customerId: null as any,
      productId: defaultProductId,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when productId is null', async () => {
    req.params = {
      customerId: defaultCustomerId,
      productId: null as any,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when customerId is empty string', async () => {
    req.params = {
      customerId: '',
      productId: defaultProductId,
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when productId is empty string', async () => {
    req.params = {
      customerId: defaultCustomerId,
      productId: '',
    };

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getProductPriceByCustomerIdUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 200 when the execution is successful', async () => {
    const mockPrice = faker.number.int({ min: 1, max: 1000 });
    const mockResponse = { price: mockPrice };

    getProductPriceByCustomerIdUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(getProductPriceByCustomerIdUseCase.execute).toHaveBeenCalledWith({
      customerId: defaultCustomerId,
      productId: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it('should return 200 when price has decimals', async () => {
    const mockResponse = { price: 99.99 };

    getProductPriceByCustomerIdUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(getProductPriceByCustomerIdUseCase.execute).toHaveBeenCalledWith({
      customerId: defaultCustomerId,
      productId: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResponse);
  });

  it('should return 404 when price is not found', async () => {
    getProductPriceByCustomerIdUseCase.execute.mockResolvedValue({
      success: false,
      error: 'PRICE NOT FOUND',
    });

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(getProductPriceByCustomerIdUseCase.execute).toHaveBeenCalledWith({
      customerId: defaultCustomerId,
      productId: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'PRICE NOT FOUND',
    });
  });

  it('should handle use case errors correctly', async () => {
    getProductPriceByCustomerIdUseCase.execute.mockResolvedValue({
      success: false,
      error: 'DATABASE ERROR',
    });

    await controller.getProductPriceByCustomer(req as Request, res as Response);

    expect(getProductPriceByCustomerIdUseCase.execute).toHaveBeenCalledWith({
      customerId: defaultCustomerId,
      productId: defaultProductId,
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'DATABASE ERROR',
    });
  });
});
