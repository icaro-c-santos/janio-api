import { GetSaleByIdUseCase } from '../getSaleById.useCase';
import { SaleRepository } from '../../repository/sale.repository';
import { ReceiptService } from '../../services/receipt.service';
import { createSaleMock } from '../../../../__tests__/mocks/sale.mock';
import { faker } from '../../../../__tests__/mocks/faker';

describe('GetSaleByIdUseCase', () => {
  let getSaleByIdUseCase: GetSaleByIdUseCase;
  let saleRepository: jest.Mocked<SaleRepository>;
  let receiptService: jest.Mocked<ReceiptService>;
  const defaultSaleId = faker.string.uuid();

  beforeEach(() => {
    saleRepository = {
      findById: jest.fn(),
    } as any;

    receiptService = {
      getUrl: jest.fn(),
    } as any;

    getSaleByIdUseCase = new GetSaleByIdUseCase(saleRepository, receiptService);
  });

  it('should return sale when found without receipt file', async () => {
    const mockSale = createSaleMock();
    mockSale.receiptFileKey = null;
    saleRepository.findById.mockResolvedValue(mockSale);

    const result = (await getSaleByIdUseCase.execute({
      id: defaultSaleId,
    })) as any;

    expect(saleRepository.findById).toHaveBeenCalledWith(defaultSaleId);
    expect(receiptService.getUrl).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(
      expect.objectContaining({
        id: mockSale.id,
        receiptFileKey: null,
      }),
    );
  });

  it('should return sale with download URL when receipt file exists', async () => {
    const mockSale = createSaleMock();
    const mockFileKey = 'receipts/test_receipt.pdf';
    const mockDownloadUrl =
      'https://storage.example.com/download/receipts/test_receipt.pdf';

    mockSale.receiptFileKey = mockFileKey;
    saleRepository.findById.mockResolvedValue(mockSale);
    receiptService.getUrl.mockResolvedValue(mockDownloadUrl);

    const result = (await getSaleByIdUseCase.execute({
      id: defaultSaleId,
    })) as any;

    expect(saleRepository.findById).toHaveBeenCalledWith(defaultSaleId);
    expect(receiptService.getUrl).toHaveBeenCalledWith(mockFileKey);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(
      expect.objectContaining({
        id: mockSale.id,
        receiptFileKey: mockFileKey,
        receiptFileUrl: mockDownloadUrl,
      }),
    );
  });

  it('should return sale without URL when receipt service fails', async () => {
    const mockSale = createSaleMock();
    const mockFileKey = 'receipts/test_receipt.pdf';

    mockSale.receiptFileKey = mockFileKey;
    saleRepository.findById.mockResolvedValue(mockSale);
    receiptService.getUrl.mockRejectedValue(new Error('Storage error'));

    const result = (await getSaleByIdUseCase.execute({
      id: defaultSaleId,
    })) as any;

    expect(saleRepository.findById).toHaveBeenCalledWith(defaultSaleId);
    expect(receiptService.getUrl).toHaveBeenCalledWith(mockFileKey);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(
      expect.objectContaining({
        id: mockSale.id,
        receiptFileKey: mockFileKey,
      }),
    );
    // Não deve ter receiptFileUrl quando há erro
    expect(result.data).not.toHaveProperty('receiptFileUrl');
  });

  it('should return error when sale is not found', async () => {
    saleRepository.findById.mockResolvedValue(null);

    const result = await getSaleByIdUseCase.execute({ id: defaultSaleId });

    expect(saleRepository.findById).toHaveBeenCalledWith(defaultSaleId);
    expect(result).toEqual({
      success: false,
      error: 'Sale not found',
      status: 404,
    });
  });

  it('should return error when repository throws an exception', async () => {
    const error = new Error('Database connection failed');
    saleRepository.findById.mockRejectedValue(error);

    const result = await getSaleByIdUseCase.execute({ id: defaultSaleId });

    expect(saleRepository.findById).toHaveBeenCalledWith(defaultSaleId);
    expect(result).toEqual({
      success: false,
      error: 'Internal server error',
      status: 500,
    });
  });
});
