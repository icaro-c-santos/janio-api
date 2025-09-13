import { CreateSaleUseCase } from '../createSale.useCase';
import { ISaleRepository } from '../../../../domain/interfaces/sales.interface';
import { IStorageService } from '../../../../domain/interfaces/storage.interface';
import { ICustomerRepository } from '../../../../domain/interfaces/customer.interface';
import { IProductRepository } from '../../../../domain/interfaces/product.interface';
import { createSaleMock } from '../../../../__tests__/mocks/sale.mock';
import { createCustomerMock } from '../../../../__tests__/mocks/customer.mock';
import { createProductMock } from '../../../../__tests__/mocks/product.mock';
import { CreateSaleInput } from '../types';

describe('CreateSaleUseCase', () => {
  let saleRepository: jest.Mocked<ISaleRepository>;
  let storageService: jest.Mocked<IStorageService>;
  let customerRepository: jest.Mocked<ICustomerRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  let createSaleUseCase: CreateSaleUseCase;
  const dateNow = new Date();
  const defaultInput: CreateSaleInput = {
    productId: '123e4567-e89b-12d3-a456-426614174000',
    customerId: '123e4567-e89b-12d3-a456-426614174001',
    quantity: 2,
    unitPrice: 50.0,
    saleDate: dateNow,
    file: null,
  };

  beforeEach(() => {
    saleRepository = {
      create: jest.fn(),
    } as any;

    storageService = {
      uploadFile: jest.fn(),
      generateDownloadUrl: jest.fn(),
      ping: jest.fn(),
    } as any;

    customerRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
    } as any;

    productRepository = {
      findById: jest.fn(),
    } as any;

    createSaleUseCase = new CreateSaleUseCase(
      saleRepository,
      storageService,
      customerRepository,
      productRepository,
    );
  });

  describe('Validation Tests', () => {
    it('should return error when quantity is not an integer', async () => {
      const input = { ...defaultInput, quantity: 2.5 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe(
        'Quantity must be an integer and more on than zero',
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when quantity is zero', async () => {
      const input = { ...defaultInput, quantity: 0 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe(
        'Quantity must be an integer and more on than zero',
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when quantity is negative', async () => {
      const input = { ...defaultInput, quantity: -1 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe(
        'Quantity must be an integer and more on than zero',
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when quantity exceeds 100', async () => {
      const input = { ...defaultInput, quantity: 101 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Quantity cannot exceed 100 units');
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when unitPrice is not a number', async () => {
      const input = { ...defaultInput, unitPrice: 'invalid' as any };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Unit price must be a positive number');
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when unitPrice is zero', async () => {
      const input = { ...defaultInput, unitPrice: 0 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Unit price must be a positive number');
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when unitPrice is negative', async () => {
      const input = { ...defaultInput, unitPrice: -10 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Unit price must be a positive number');
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when unitPrice exceeds 100000', async () => {
      const input = { ...defaultInput, unitPrice: 1000000 };

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe('Unit price cannot exceed 100000');
      expect(saleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Repository Validation Tests', () => {
    it('should return error when customer is not found', async () => {
      customerRepository.findById.mockResolvedValue(null);

      const result = (await createSaleUseCase.execute(defaultInput)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe(
        `Cannot find customer with id ${defaultInput.customerId}`,
      );
      expect(customerRepository.findById).toHaveBeenCalledWith(
        defaultInput.customerId,
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should return error when product is not found', async () => {
      const customer = createCustomerMock();
      customerRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(null);

      const result = (await createSaleUseCase.execute(defaultInput)) as any;

      expect(result.success).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBe(
        `Cannot find product with id ${defaultInput.productId}`,
      );
      expect(customerRepository.findById).toHaveBeenCalledWith(
        defaultInput.customerId,
      );
      expect(productRepository.findById).toHaveBeenCalledWith(
        defaultInput.productId,
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Successful Sale Creation', () => {
    beforeEach(() => {
      const customer = createCustomerMock();
      const product = createProductMock();
      customerRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
    });

    it('should create sale successfully without file', async () => {
      const mockCreatedSale = createSaleMock({
        productId: defaultInput.productId,
        customerId: defaultInput.customerId,
        quantity: defaultInput.quantity,
        unitPrice: defaultInput.unitPrice,
        receiptUrl: null,
        saleDate: defaultInput.saleDate,
        totalPrice: 100.0,
      });

      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute({
        ...defaultInput,
        file: null,
      })) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: mockCreatedSale.id,
        productId: mockCreatedSale.productId,
        customerId: mockCreatedSale.customerId,
        quantity: mockCreatedSale.quantity,
        unitPrice: mockCreatedSale.unitPrice,
        totalPrice: mockCreatedSale.totalPrice,
        saleDate: mockCreatedSale.saleDate,
        receiptUrl: null,
      });

      expect(saleRepository.create).toHaveBeenCalledWith({
        productId: defaultInput.productId,
        customerId: defaultInput.customerId,
        quantity: defaultInput.quantity,
        unitPrice: defaultInput.unitPrice,
        saleDate: mockCreatedSale.saleDate,
        totalPrice: mockCreatedSale.totalPrice,
        receiptUrl: null,
      });

      expect(storageService.uploadFile).not.toHaveBeenCalled();
      expect(storageService.generateDownloadUrl).not.toHaveBeenCalled();
    });

    it('should create sale successfully with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake file content'),
      } as Express.Multer.File;

      const input = { ...defaultInput, file: mockFile };
      const mockCreatedSale = createSaleMock({
        productId: defaultInput.productId,
        customerId: defaultInput.customerId,
        quantity: defaultInput.quantity,
        unitPrice: defaultInput.unitPrice,
        receiptUrl: 'https://storage.example.com/receipts/test.pdf',
      });

      const customer = createCustomerMock();
      customerRepository.findById.mockResolvedValue(customer);
      storageService.uploadFile.mockResolvedValue();
      storageService.generateDownloadUrl.mockResolvedValue(
        'https://storage.example.com/receipts/test.pdf',
      );
      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(true);
      expect(result.data.receiptUrl).toBe(
        'https://storage.example.com/receipts/test.pdf',
      );

      expect(storageService.uploadFile).toHaveBeenCalledWith({
        buffer: mockFile.buffer,
        key: expect.stringMatching(/^receipts\/.*\.pdf$/),
        contentType: 'application/pdf',
      });

      expect(storageService.generateDownloadUrl).toHaveBeenCalledWith({
        path: expect.stringMatching(/^receipts\/.*\.pdf$/),
      });

      expect(saleRepository.create).toHaveBeenCalledWith({
        productId: defaultInput.productId,
        customerId: defaultInput.customerId,
        quantity: defaultInput.quantity,
        unitPrice: defaultInput.unitPrice,
        saleDate: dateNow,
        totalPrice: 100.0,
        receiptUrl: 'https://storage.example.com/receipts/test.pdf',
      });
    });

    it('should calculate total price correctly with decimal values', async () => {
      const input = {
        ...defaultInput,
        quantity: 3,
        unitPrice: 33.33,
      };

      const mockCreatedSale = createSaleMock({
        totalPrice: 99.99,
      });

      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(true);
      expect(saleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          totalPrice: 99.99,
        }),
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      const customer = createCustomerMock();
      const product = createProductMock();
      customerRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
    });

    it('should propagate error when saleRepository.create throws', async () => {
      const error = new Error('Database error');
      saleRepository.create.mockRejectedValue(error);

      await expect(createSaleUseCase.execute(defaultInput)).rejects.toThrow(
        'Database error',
      );

      expect(saleRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should propagate error when storageService.uploadFile throws', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake file content'),
      } as Express.Multer.File;

      const input = { ...defaultInput, file: mockFile };
      const error = new Error('Storage error');
      storageService.uploadFile.mockRejectedValue(error);

      await expect(createSaleUseCase.execute(input) as any).rejects.toThrow(
        'Storage error',
      );

      expect(storageService.uploadFile).toHaveBeenCalledTimes(1);
    });

    it('should propagate error when storageService.generateDownloadUrl throws', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        encoding: '7bit',
        mimetype: 'application/pdf',
        size: 1024,
        buffer: Buffer.from('fake file content'),
      } as Express.Multer.File;

      const input = { ...defaultInput, file: mockFile };
      const error = new Error('URL generation error');
      storageService.uploadFile.mockResolvedValue();
      storageService.generateDownloadUrl.mockRejectedValue(error);

      await expect(createSaleUseCase.execute(input) as any).rejects.toThrow(
        'URL generation error',
      );

      expect(storageService.uploadFile).toHaveBeenCalledTimes(1);
      expect(storageService.generateDownloadUrl).toHaveBeenCalledTimes(1);
    });
  });
});
