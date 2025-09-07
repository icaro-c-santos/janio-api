import { createCustomerMock } from '../../../__tests__/mocks/customer.mock';
import { CustomerRepository } from '../../../infraestructure/repositories/customer.repository';
import { GetAllCustomersUseCase } from '../customer/get-all-customers.use.case';
import { CustomerMapResponse } from '../customer/mappers/customerToCustomeResponse.mapper';
import { GetAllCustomersInput } from '../customer/types';

describe('GetAllCustomersUseCase', () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let getAllCustomersUseCase: GetAllCustomersUseCase;
  const defaultInput: GetAllCustomersInput = {
    page: 1,
    pageSize: 10,
  };

  beforeEach(() => {
    customerRepository = {
      findAll: jest.fn(),
    } as any;

    getAllCustomersUseCase = new GetAllCustomersUseCase(customerRepository);
  });

  it('should return an list of customers', async () => {
    const customers = [createCustomerMock(), createCustomerMock()];
    const mockResponse = customers.map((item) =>
      CustomerMapResponse.mapCustomerToResponse(item),
    );
    customerRepository.findAll.mockResolvedValueOnce({
      skip: 0,
      total: 2,
      items: customers,
      take: 10,
    });
    const result = (await getAllCustomersUseCase.execute(defaultInput)) as any;
    expect(result.success).toBe(true);

    expect(result.data).toEqual({
      page: 1,
      pageSize: 10,
      total: 2,
      items: mockResponse,
    });

    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(customerRepository.findAll).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
    });
  });

  it('should return empty customer list with correct pagination', async () => {
    customerRepository.findAll.mockResolvedValueOnce({
      skip: 7,
      total: 2,
      items: [],
      take: 7,
    });
    const result = (await getAllCustomersUseCase.execute({
      page: 2,
      pageSize: 7,
    })) as any;
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 2,
      pageSize: 7,
      total: 2,
      items: [],
    });
    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(customerRepository.findAll).toHaveBeenCalledWith({
      skip: 7,
      take: 7,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
    });
  });

  it('should use default pagination when no input is provided', async () => {
    const customers = [createCustomerMock()];
    const mockResponse = customers.map((item) =>
      CustomerMapResponse.mapCustomerToResponse(item),
    );
    customerRepository.findAll.mockResolvedValueOnce({
      skip: 0,
      total: 1,
      items: customers,
      take: 10,
    });
    const result = (await getAllCustomersUseCase.execute({} as any)) as any;

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      page: 1,
      pageSize: 10,
      total: 1,
      items: mockResponse,
    });
    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(customerRepository.findAll).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
    });
  });

  it('should use default pageSize when only page is provided', async () => {
    const page = 2;
    const mockResult = [createCustomerMock()];
    customerRepository.findAll.mockResolvedValueOnce({
      skip: 10,
      total: 15,
      items: mockResult,
      take: 10,
    });

    const result = (await getAllCustomersUseCase.execute({
      page,
    } as any)) as any;

    expect(result.success).toBe(true);
    expect(result.data.page).toBe(page);
    expect(result.data.pageSize).toBe(10);
    expect(result.data.items).toBeDefined();
    expect(customerRepository.findAll).toHaveBeenCalledWith({
      skip: 10,
      take: 10,
      getOnlyPrimaryAddresses: true,
      getOnlyPrimaryPhones: true,
    });
  });

  it('should propagate error when repository.findAll throws', async () => {
    customerRepository.findAll.mockRejectedValueOnce(new Error('DB error'));

    await expect(getAllCustomersUseCase.execute(defaultInput)).rejects.toThrow(
      'DB error',
    );

    expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
