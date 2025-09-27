import { SaleMapResponse } from './mappers/mapSaleToSaleResponse.mapper';
import { ReceiptService } from '../services/receipt.service';
import { ISaleRepository, SaleDomain } from '../domain/sales.interface';
import { Result } from '../../shared/types/result';
import { IGetSaleByIdUseCase } from '../types';

export interface GetSaleByIdInput {
  id: string;
}

export class GetSaleByIdUseCase implements IGetSaleByIdUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private receiptService: ReceiptService,
  ) {}

  async execute(input: GetSaleByIdInput): Promise<Result<SaleDomain>> {
    const sale = await this.saleRepository.findById(input.id);

    if (!sale) {
      return {
        success: false,
        error: 'Sale not found',
        status: 404,
      };
    }

    let receiptFileUrl: string | null = null;
    if (sale?.receiptFileKey) {
      receiptFileUrl = await this.receiptService.getUrl(sale.receiptFileKey);
    }

    const saleResponse = SaleMapResponse.mapSaleToResponse({
      ...sale,
      receiptFileUrl,
    });

    return {
      success: true,
      data: saleResponse,
    };
  }
}
