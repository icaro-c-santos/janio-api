import { Request, Response } from 'express';
import { CustomerController } from '../customer.controller';
import { createCustomerMock } from '../../../../__tests__/mocks/customer.mock';
import { GetAllCustomersUseCase } from '../../../../aplication/usecases/customer/get-all-customers.use.case';
import { CreateCustomerUseCase } from '../../../../aplication/usecases/customer/create-customer.use.case';
import { CustomerMapResponse } from '../../../../aplication/usecases/customer/mappers/customerToCustomeResponse.mapper';

describe('CustomerController - createCustomer', () => {
  let getAllCustomersUseCase: jest.Mocked<GetAllCustomersUseCase>;
  let createCustomerUseCase: jest.Mocked<CreateCustomerUseCase>;
  let controller: CustomerController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const validIndividualRequest = {
    user: {
      type: 'INDIVIDUAL',
      email: 'joao@email.com',
      individual: {
        cpf: '12345678901',
        fullName: 'João Silva',
        birthDate: '1990-01-01T00:00:00.000Z',
      },
      address: {
        street: 'Rua das Flores',
        number: '123',
        district: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01234567',
        country: 'Brasil',
        isPrimary: true,
      },
      phone: {
        areaCode: '11',
        number: '999999999',
        isPrimary: true,
        isWhatsapp: true,
        type: 'MOBILE',
      },
    },
  };

  const validCompanyRequest = {
    user: {
      type: 'COMPANY',
      email: 'contato@empresa.com',
      company: {
        cnpj: '12345678000195',
        legalName: 'Empresa Exemplo Ltda',
        tradeName: 'Empresa Exemplo',
        stateRegistration: '123456789',
      },
      address: {
        street: 'Av. Paulista',
        number: '1000',
        district: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310100',
        country: 'Brasil',
        isPrimary: true,
      },
      phone: {
        areaCode: '11',
        number: '33334444',
        isPrimary: true,
        isWhatsapp: false,
        type: 'FIXED',
      },
    },
  };

  beforeEach(() => {
    getAllCustomersUseCase = {
      execute: jest.fn(),
    } as any;

    createCustomerUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new CustomerController(
      getAllCustomersUseCase,
      createCustomerUseCase,
    );

    req = {
      body: validIndividualRequest,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 when user type is invalid', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        type: 'INVALID_TYPE',
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when email is invalid', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        email: 'invalid-email',
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when email is missing', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        email: undefined,
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when individual data is missing for INDIVIDUAL type', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        individual: undefined,
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when company data is missing for COMPANY type', async () => {
    req.body = {
      user: {
        ...validCompanyRequest.user,
        company: undefined,
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when CPF is too short', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        individual: {
          ...validIndividualRequest.user.individual,
          cpf: '123',
        },
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when CNPJ is too short', async () => {
    req.body = {
      user: {
        ...validCompanyRequest.user,
        company: {
          ...validCompanyRequest.user.company,
          cnpj: '123',
        },
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when address fields are missing', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        address: {
          ...validIndividualRequest.user.address,
          street: '',
        },
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when phone fields are missing', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        phone: {
          ...validIndividualRequest.user.phone,
          areaCode: '',
        },
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 400 when phone type is invalid', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        phone: {
          ...validIndividualRequest.user.phone,
          type: 'INVALID_TYPE',
        },
      },
    };

    await controller.createCustomer(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'INVALID DATA',
      }),
    );
    expect(createCustomerUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return 201 when individual customer is created successfully', async () => {
    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    createCustomerUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.createCustomer(req as Request, res as Response);

    expect(createCustomerUseCase.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResponse,
    });
  });

  it('should return 201 when company customer is created successfully', async () => {
    req.body = validCompanyRequest;

    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    createCustomerUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.createCustomer(req as Request, res as Response);

    expect(createCustomerUseCase.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResponse,
    });
  });

  it('should return 400 when use case returns error', async () => {
    createCustomerUseCase.execute.mockResolvedValue({
      success: false,
      error: 'Customer creation failed',
      status: 400,
    });

    await controller.createCustomer(req as Request, res as Response);

    expect(createCustomerUseCase.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Customer creation failed',
    });
  });

  it('should handle individual customer without birthDate', async () => {
    req.body = {
      user: {
        ...validIndividualRequest.user,
        individual: {
          cpf: '12345678901',
          fullName: 'João Silva',
          // birthDate is optional
        },
      },
    };

    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    createCustomerUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.createCustomer(req as Request, res as Response);

    expect(createCustomerUseCase.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResponse,
    });
  });

  it('should handle company customer without optional fields', async () => {
    req.body = {
      user: {
        ...validCompanyRequest.user,
        company: {
          cnpj: '12345678000195',
          legalName: 'Empresa Exemplo Ltda',
          // tradeName and stateRegistration are optional
        },
      },
    };

    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    createCustomerUseCase.execute.mockResolvedValue({
      success: true,
      data: mockResponse,
    });

    await controller.createCustomer(req as Request, res as Response);

    expect(createCustomerUseCase.execute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockResponse,
    });
  });
});
