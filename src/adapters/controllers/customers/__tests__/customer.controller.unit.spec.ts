import { Request, Response } from 'express';
import { CustomerController } from '../customer.controller';
import { createCustomerMock } from '../../../../__tests__/mocks/customer.mock';
import { GetAllCustomersUseCase } from '../../../../aplication/usecases/customer/get-all-customers.use.case';
import { CustomerMapResponse } from '../../../../aplication/usecases/customer/mappers/customerToCustomeResponse.mapper';

describe('CustomerController - getAllCustomers', () => {
  let getAllCustomersUseCase: jest.Mocked<GetAllCustomersUseCase>;
  let controller: CustomerController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    getAllCustomersUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new CustomerController(getAllCustomersUseCase);

    req = {
      query: {
        page: '1',
        pageSize: '10',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 when page is not an integer', async () => {
    req.query = { page: 'abc', pageSize: '10' };

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getAllCustomersUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when page is not greater than 0', async () => {
    req.query = { page: '-1', pageSize: '10' };

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getAllCustomersUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when pageSize is not an integer', async () => {
    req.query = { page: '1', pageSize: 'abc' };

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getAllCustomersUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when pageSize is not greater than 0', async () => {
    req.query = { page: '1', pageSize: '-5' };

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(getAllCustomersUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 201 when the execution to be success', async () => {
    const mockResult = [createCustomerMock(), createCustomerMock()];
    const mockResponse = mockResult.map((item) =>
      CustomerMapResponse.mapCustomerToResponse(item),
    );
    getAllCustomersUseCase.execute.mockResolvedValue({
      success: true,
      data: {
        page: 1,
        items: mockResponse,
        pageSize: 10,
        total: 2,
      },
    });

    await controller.getAllCustomers(req as Request, res as Response);

    expect(getAllCustomersUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: {
          page: 1,
          items: mockResponse,
          pageSize: 10,
          total: 2,
        },
      }),
    );
  });

  it('should return 201 when called without optional parameters', async () => {
    req.query = {};
    const mockResult = [createCustomerMock(), createCustomerMock()];
    const mockResponse = mockResult.map((item) =>
      CustomerMapResponse.mapCustomerToResponse(item),
    );
    getAllCustomersUseCase.execute.mockResolvedValue({
      success: true,
      data: {
        page: 1,
        items: mockResponse,
        pageSize: 10,
        total: 2,
      },
    });

    await controller.getAllCustomers(req as Request, res as Response);

    expect(getAllCustomersUseCase.execute).toHaveBeenCalledWith({
      page: undefined,
      pageSize: undefined,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: {
          page: 1,
          items: mockResponse,
          pageSize: 10,
          total: 2,
        },
      }),
    );
  });

  it('should return erro with the status code returned by the use case', async () => {
    getAllCustomersUseCase.execute.mockResolvedValue({
      success: false,
      error: 'NOT FOUND PRODUCT',
      status: 404,
    });

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'NOT FOUND PRODUCT',
      }),
    );
  });

  it('should return 500 when use case not return status', async () => {
    getAllCustomersUseCase.execute.mockResolvedValue({
      success: false,
      error: 'Any Erro',
    });

    await controller.getAllCustomers(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: 'Any Erro',
      }),
    );
  });
});
