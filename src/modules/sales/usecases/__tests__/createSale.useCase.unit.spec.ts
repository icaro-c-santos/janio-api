import { CreateSaleUseCase } from '../createSale.useCase';
import { IProductRepository } from '../../../products/domain/product.interface';
import { ReceiptService } from '../../services/receipt.service';
import { createSaleMock } from '../../../../__tests__/mocks/sale.mock';
import { createCustomerMock } from '../../../../__tests__/mocks/customer.mock';
import { createProductMock } from '../../../../__tests__/mocks/product.mock';
import { CreateSaleInput } from '../../types';
import { SaleMapResponse } from '../mappers/mapSaleToSaleResponse.mapper';
import { ISaleRepository } from '../../domain/sales.interface';
import { ICustomerRepository } from '../../../customers/domain/customer.interface';

describe('CreateSaleUseCase', () => {
  let saleRepository: jest.Mocked<ISaleRepository>;
  let customerRepository: jest.Mocked<ICustomerRepository>;
  let productRepository: jest.Mocked<IProductRepository>;
  let receiptService: jest.Mocked<ReceiptService>;
  let createSaleUseCase: CreateSaleUseCase;

  const dateNow = new Date();
  const defaultInput: CreateSaleInput = {
    productId: 'prod-123',
    customerId: 'cust-123',
    quantity: 2,
    unitPrice: 50.0,
    saleDate: dateNow,
    file: null,
  };

  beforeEach(() => {
    saleRepository = { create: jest.fn() } as any;
    customerRepository = { findById: jest.fn(), findAll: jest.fn() } as any;
    productRepository = { findById: jest.fn() } as any;
    receiptService = { upload: jest.fn(), getUrl: jest.fn() } as any;

    createSaleUseCase = new CreateSaleUseCase(
      saleRepository,
      customerRepository,
      productRepository,
      receiptService,
    );
  });

  describe('Validation Tests', () => {
    it.each([
      {
        quantity: 0,
        error: 'Quantity must be an integer and more on than zero',
      },
      {
        quantity: -1,
        error: 'Quantity must be an integer and more on than zero',
      },
      { quantity: 101, error: 'Quantity cannot exceed 100 units' },
      {
        quantity: 2.5,
        error: 'Quantity must be an integer and more on than zero',
      },
    ])(
      'should fail for invalid quantity $quantity',
      async ({ quantity, error }) => {
        const result = (await createSaleUseCase.execute({
          ...defaultInput,
          quantity,
        })) as any;
        expect(result.success).toBe(false);
        expect(result.error).toBe(error);
        expect(saleRepository.create).not.toHaveBeenCalled();
      },
    );

    it.each([
      { unitPrice: 0, error: 'Unit price must be a positive number' },
      { unitPrice: -10, error: 'Unit price must be a positive number' },
      { unitPrice: 1000000, error: 'Unit price cannot exceed 100000' },
      {
        unitPrice: 'invalid' as any,
        error: 'Unit price must be a positive number',
      },
    ])(
      'should fail for invalid unitPrice $unitPrice',
      async ({ unitPrice, error }) => {
        const result = (await createSaleUseCase.execute({
          ...defaultInput,
          unitPrice,
        })) as any;
        expect(result.success).toBe(false);
        expect(result.error).toBe(error);
        expect(saleRepository.create).not.toHaveBeenCalled();
      },
    );
  });

  describe('Repository Validation Tests', () => {
    it('should fail if customer not found', async () => {
      customerRepository.findById.mockResolvedValue(null);
      const result = (await createSaleUseCase.execute(defaultInput)) as any;
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        `Cannot find customer with id ${defaultInput.customerId}`,
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });

    it('should fail if product not found', async () => {
      customerRepository.findById.mockResolvedValue(createCustomerMock());
      productRepository.findById.mockResolvedValue(null);
      const result = (await createSaleUseCase.execute(defaultInput)) as any;
      expect(result.success).toBe(false);
      expect(result.error).toBe(
        `Cannot find product with id ${defaultInput.productId}`,
      );
      expect(saleRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('Successful Sale Creation', () => {
    let customer: any;
    let product: any;

    beforeEach(() => {
      customer = createCustomerMock();
      product = createProductMock();
      customerRepository.findById.mockResolvedValue(customer);
      productRepository.findById.mockResolvedValue(product);
    });

    it('should create sale successfully without file', async () => {
      const mockCreatedSale = createSaleMock({
        receiptFileKey: null,
        totalPrice: 100.0,
      });
      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute({
        ...defaultInput,
        file: null,
      })) as any;

      expect(result.success).toBe(true);
      expect(result.data).toEqual(
        SaleMapResponse.mapSaleToResponse({
          ...mockCreatedSale,
          receiptFileUrl: null,
        }),
      );

      expect(saleRepository.create).toHaveBeenCalledWith({
        customerId: defaultInput.customerId,
        productId: defaultInput.productId,
        quantity: defaultInput.quantity,
        saleDate: defaultInput.saleDate,
        unitPrice: defaultInput.unitPrice,
        totalPrice: 100.0,
        receiptFileKey: null,
      });

      expect(receiptService.upload).not.toHaveBeenCalled();
      expect(receiptService.getUrl).not.toHaveBeenCalled();
    });

    it('should create sale successfully with file', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      const input = { ...defaultInput, file: mockFile };

      receiptService.upload.mockResolvedValue('receipts/fake-file.pdf');
      receiptService.getUrl.mockResolvedValue(
        'https://storage.example.com/receipts/fake-file.pdf',
      );

      const mockCreatedSale = createSaleMock({
        receiptFileKey: 'receipts/fake-file.pdf',
        totalPrice: 100.0,
      });
      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(true);
      expect(result.data.receiptFileUrl).toBe(
        'https://storage.example.com/receipts/fake-file.pdf',
      );

      expect(receiptService.upload).toHaveBeenCalledWith(mockFile, customer);
      expect(receiptService.getUrl).toHaveBeenCalledWith(
        'receipts/fake-file.pdf',
      );
      expect(saleRepository.create).toHaveBeenCalledWith({
        customerId: defaultInput.customerId,
        productId: defaultInput.productId,
        quantity: defaultInput.quantity,
        saleDate: defaultInput.saleDate,
        unitPrice: defaultInput.unitPrice,
        totalPrice: 100.0,
        receiptFileKey: 'receipts/fake-file.pdf',
      });
    });

    it('should calculate total price correctly', async () => {
      const input = { ...defaultInput, quantity: 3, unitPrice: 33.33 };
      const mockCreatedSale = createSaleMock({ totalPrice: 99.99 });
      saleRepository.create.mockResolvedValue(mockCreatedSale);

      const result = (await createSaleUseCase.execute(input)) as any;

      expect(result.success).toBe(true);
      expect(saleRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ totalPrice: 99.99 }),
      );
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      customerRepository.findById.mockResolvedValue(createCustomerMock());
      productRepository.findById.mockResolvedValue(createProductMock());
    });

    it('should propagate saleRepository error', async () => {
      saleRepository.create.mockRejectedValue(new Error('Database error'));
      await expect(createSaleUseCase.execute(defaultInput)).rejects.toThrow(
        'Database error',
      );
    });

    it('should propagate receiptService.upload error', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      receiptService.upload.mockRejectedValue(new Error('Upload error'));
      await expect(
        createSaleUseCase.execute({ ...defaultInput, file: mockFile }) as any,
      ).rejects.toThrow('Upload error');
    });

    it('should propagate receiptService.getUrl error', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'receipt.pdf',
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;
      receiptService.upload.mockResolvedValue('receipts/fake-file.pdf');
      receiptService.getUrl.mockRejectedValue(new Error('URL error'));
      await expect(
        createSaleUseCase.execute({ ...defaultInput, file: mockFile }) as any,
      ).rejects.toThrow('URL error');
    });
  });
});
