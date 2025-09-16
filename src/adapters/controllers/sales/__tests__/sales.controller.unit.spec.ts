import { Request, Response } from 'express';
import { SaleController } from '../sales.controller';
import { createSaleMock } from '../../../../__tests__/mocks/sale.mock';
import { CreateSaleUseCase } from '../../../../aplication/usecases/sale/createSale.useCase';
import { faker } from '../../../../__tests__/mocks/faker';

describe('SaleController - createSale', () => {
  let createSaleUseCase: jest.Mocked<CreateSaleUseCase>;
  let controller: SaleController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  const defaultCustomerId = faker.string.uuid();
  const defaultProductId = faker.string.uuid();

  beforeEach(() => {
    createSaleUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new SaleController(createSaleUseCase, {} as any);

    req = {
      body: {
        productId: defaultProductId,
        customerId: defaultCustomerId,
        quantity: 2,
        unitPrice: 50.0,
        saleDate: new Date('2024-01-15').toISOString(),
      },
      file: undefined,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 when productId is not a valid UUID', async () => {
    req.body = {
      ...req.body,
      productId: 'invalid-uuid',
    };

    await controller.createSale(req as Request, res as Response);

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
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when customerId is not a valid UUID', async () => {
    req.body = {
      ...req.body,
      customerId: 'invalid-uuid',
    };

    await controller.createSale(req as Request, res as Response);

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
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when quantity is not an integer', async () => {
    req.body = {
      ...req.body,
      quantity: 2.5,
    };

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['quantity'],
            message: 'quantity must be an integer',
          }),
        ]),
      }),
    );
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when quantity is not greater than 0', async () => {
    req.body = {
      ...req.body,
      quantity: 0,
    };

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['quantity'],
            message: 'quantity must be greater than 0',
          }),
        ]),
      }),
    );
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when unitPrice is not greater than 0', async () => {
    req.body = {
      ...req.body,
      unitPrice: -10,
    };

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['unitPrice'],
            message: 'unitPrice must be greater than 0',
          }),
        ]),
      }),
    );
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when saleDate is not a valid date', async () => {
    req.body = {
      ...req.body,
      saleDate: 'invalid-date',
    };

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['saleDate'],
            message: 'saleDate is required',
          }),
        ]),
      }),
    );
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when saleDate is missing', async () => {
    req.body = {
      productId: defaultProductId,
      customerId: defaultCustomerId,
      quantity: 2,
      unitPrice: 50.0,
    };

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: ['saleDate'],
            message: 'saleDate is required',
          }),
        ]),
      }),
    );
    expect(createSaleUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 201 when the execution is successful', async () => {
    const mockSale = createSaleMock();
    createSaleUseCase.execute.mockResolvedValue({
      success: true,
      data: mockSale,
    });

    await controller.createSale(req as Request, res as Response);

    expect(createSaleUseCase.execute).toHaveBeenCalledWith({
      productId: defaultProductId,
      customerId: defaultCustomerId,
      quantity: 2,
      unitPrice: 50.0,
      file: null,
      saleDate: new Date(req.body.saleDate),
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockSale,
      message: 'Sale created successfully',
    });
  });

  it('should return 201 when the execution is successful with file', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: 'receipt.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      size: 1024,
      buffer: Buffer.from('fake file content'),
    } as Express.Multer.File;

    req.file = mockFile;

    const mockSale = createSaleMock();
    createSaleUseCase.execute.mockResolvedValue({
      success: true,
      data: mockSale,
    });

    await controller.createSale(req as Request, res as Response);

    expect(createSaleUseCase.execute).toHaveBeenCalledWith({
      productId: defaultProductId,
      customerId: defaultCustomerId,
      quantity: 2,
      unitPrice: 50.0,
      file: mockFile,
      saleDate: new Date(req.body.saleDate),
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockSale,
      message: 'Sale created successfully',
    });
  });

  it('should return error with the status code returned by the use case', async () => {
    createSaleUseCase.execute.mockResolvedValue({
      success: false,
      error: 'PRODUCT NOT FOUND',
      status: 404,
    });

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'PRODUCT NOT FOUND',
    });
  });

  it('should return 500 when use case does not return status', async () => {
    createSaleUseCase.execute.mockResolvedValue({
      success: false,
      error: 'INTERNAL SERVER ERROR',
    });

    await controller.createSale(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'INTERNAL SERVER ERROR',
    });
  });

  it('should handle numeric string inputs correctly', async () => {
    const dateNow = new Date();
    req.body = {
      productId: defaultProductId,
      customerId: defaultCustomerId,
      quantity: '5',
      unitPrice: '25.50',
      totalPrice: '127.50',
      saleDate: dateNow.toISOString(),
    };

    const mockSale = createSaleMock();
    createSaleUseCase.execute.mockResolvedValue({
      success: true,
      data: mockSale,
    });

    await controller.createSale(req as Request, res as Response);

    expect(createSaleUseCase.execute).toHaveBeenCalledWith({
      productId: defaultProductId,
      customerId: defaultCustomerId,
      quantity: 5,
      unitPrice: 25.5,
      file: null,
      saleDate: dateNow,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockSale,
      message: 'Sale created successfully',
    });
  });
});
