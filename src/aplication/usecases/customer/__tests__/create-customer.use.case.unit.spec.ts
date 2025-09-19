import { createCustomerMock } from '../../../../__tests__/mocks/customer.mock';
import { CustomerRepository } from '../../../../infraestructure/repositories/customers/customer.repository';
import { CreateCustomerUseCase } from '../create-customer.use.case';
import { CustomerMapResponse } from '../mappers/customerToCustomeResponse.mapper';
import { CreateCustomerInput } from '../types';

describe('CreateCustomerUseCase', () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let createCustomerUseCase: CreateCustomerUseCase;

  const mockIndividualInput: CreateCustomerInput = {
    user: {
      type: 'INDIVIDUAL',
      email: 'joao@email.com',
      individual: {
        cpf: '12345678901',
        fullName: 'João Silva',
        birthDate: new Date('1990-01-01'),
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
        type: 'MOBILE' as any,
      },
    } as any,
  };

  const mockCompanyInput: CreateCustomerInput = {
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
        type: 'FIXED' as any,
      },
    } as any,
  };

  beforeEach(() => {
    customerRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
    } as any;

    createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  });

  it('should create an individual customer successfully', async () => {
    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockResolvedValueOnce(mockCustomer);

    const result = await createCustomerUseCase.execute(mockIndividualInput);

    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(mockResponse);
    expect(customerRepository.create).toHaveBeenCalledTimes(1);
    expect(customerRepository.create).toHaveBeenCalledWith({
      user: {
        type: 'INDIVIDUAL',
        email: 'joao@email.com',
        individual: {
          cpf: '12345678901',
          fullName: 'João Silva',
          birthDate: new Date('1990-01-01'),
        },
        address: {
          city: 'São Paulo',
          country: 'Brasil',
          district: 'Centro',
          state: 'SP',
          number: '123',
          street: 'Rua das Flores',
          postalCode: '01234567',
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
    });
  });

  it('should create a company customer successfully', async () => {
    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockResolvedValueOnce(mockCustomer);

    const result = await createCustomerUseCase.execute(mockCompanyInput);

    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(mockResponse);
    expect(customerRepository.create).toHaveBeenCalledTimes(1);
    expect(customerRepository.create).toHaveBeenCalledWith({
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
          city: 'São Paulo',
          country: 'Brasil',
          district: 'Bela Vista',
          state: 'SP',
          number: '1000',
          street: 'Av. Paulista',
          postalCode: '01310100',
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
    });
  });

  it('should return error when repository.create throws', async () => {
    const errorMessage = 'Database error';

    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockRejectedValueOnce(new Error(errorMessage));

    const result = await createCustomerUseCase.execute(mockIndividualInput);

    expect(result.success).toBe(false);
    expect((result as any).error).toBe(errorMessage);
    expect((result as any).status).toBe(500);
    expect(customerRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should return error when repository.create throws unknown error', async () => {
    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockRejectedValueOnce('Unknown error');

    const result = await createCustomerUseCase.execute(mockIndividualInput);

    expect(result.success).toBe(false);
    expect((result as any).error).toBe('Unknown error');
    expect((result as any).status).toBe(500);
    expect(customerRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should handle individual customer without birthDate', async () => {
    const inputWithoutBirthDate: CreateCustomerInput = {
      ...mockIndividualInput,
      user: {
        ...mockIndividualInput.user,
        individual: {
          ...mockIndividualInput.user.individual!,
          birthDate: undefined,
        },
      } as any,
    };

    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockResolvedValueOnce(mockCustomer);

    const result = await createCustomerUseCase.execute(inputWithoutBirthDate);

    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(mockResponse);
    expect(customerRepository.create).toHaveBeenCalledWith({
      user: {
        type: 'INDIVIDUAL',
        email: 'joao@email.com',
        individual: {
          cpf: '12345678901',
          fullName: 'João Silva',
          birthDate: undefined,
        },
        address: {
          city: 'São Paulo',
          country: 'Brasil',
          district: 'Centro',
          state: 'SP',
          number: '123',
          street: 'Rua das Flores',
          postalCode: '01234567',
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
    });
  });

  it('should handle company customer without optional fields', async () => {
    const inputWithoutOptionalFields: CreateCustomerInput = {
      ...mockCompanyInput,
      user: {
        ...mockCompanyInput.user,
        company: {
          cnpj: '12345678000195',
          legalName: 'Empresa Exemplo Ltda',
          tradeName: '',
          stateRegistration: '',
        },
      } as any,
    };

    const mockCustomer = createCustomerMock();
    const mockResponse =
      CustomerMapResponse.mapCustomerToResponse(mockCustomer);

    customerRepository.findAll.mockResolvedValueOnce({
      total: 0,
      take: 10,
      skip: 0,
      items: [],
    });

    customerRepository.create.mockResolvedValueOnce(mockCustomer);

    const result = await createCustomerUseCase.execute(
      inputWithoutOptionalFields,
    );

    expect(result.success).toBe(true);
    expect((result as any).data).toEqual(mockResponse);
    expect(customerRepository.create).toHaveBeenCalledWith({
      user: {
        type: 'COMPANY',
        email: 'contato@empresa.com',
        company: {
          cnpj: '12345678000195',
          legalName: 'Empresa Exemplo Ltda',
          tradeName: '',
          stateRegistration: '',
        },
        address: {
          city: 'São Paulo',
          country: 'Brasil',
          district: 'Bela Vista',
          state: 'SP',
          number: '1000',
          street: 'Av. Paulista',
          postalCode: '01310100',
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
    });
  });
});
