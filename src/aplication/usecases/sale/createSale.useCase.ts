import {
  ISaleRepository,
  CreateSaleData,
} from '../../../domain/interfaces/sales.interface';
import { Result } from '../../types/result';
import {
  CreateSaleResponse,
  ICreateSaleUseCase,
  CreateSaleInput,
} from './types';
import { IStorageService } from '../../../domain/interfaces/storage.interface';
import { ICustomerRepository } from '../../../domain/interfaces/customer.interface';
import { IProductRepository } from '../../../domain/interfaces/product.interface';
import { SaleMapResponse } from './mappers/mapSaleToSaleResponse.mapper';
import { ReceiptService } from './services/receipt.service';

export class CreateSaleUseCase implements ICreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private storageService: IStorageService,
    private customerRepository: ICustomerRepository,
    private productRepository: IProductRepository,
    private receiptService: ReceiptService,
  ) {}

  async execute(input: CreateSaleInput): Promise<Result<CreateSaleResponse>> {
    const quantityError = this.validateQuantity(input.quantity);
    if (!quantityError.success) {
      return quantityError;
    }

    const unitPriceError = this.validateUnitPrice(input.unitPrice);
    if (!unitPriceError.success) {
      return unitPriceError;
    }

    const customer = await this.customerRepository.findById(input.customerId);
    if (!customer) {
      return {
        success: false,
        error: `Cannot find customer with id ${input.customerId}`,
      };
    }

    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      return {
        success: false,
        error: `Cannot find product with id ${input.productId}`,
      };
    }

    const totalPrice = this.calculateTotalPrice(
      input.quantity,
      input.unitPrice,
    );

    let receiptFileKey: string | null = null;
    let receiptFileUrl: string | null = null;

    if (input.file) {
      receiptFileKey = await this.receiptService.upload(input.file, customer);
    }

    const saleData: CreateSaleData = {
      productId: input.productId,
      customerId: input.customerId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      saleDate: input.saleDate,
      totalPrice,
      receiptFileKey,
    };

    const createdSale = await this.saleRepository.create(saleData);

    if (receiptFileKey) {
      receiptFileUrl = await this.receiptService.getUrl(receiptFileKey);
    }

    return {
      success: true,
      data: SaleMapResponse.mapSaleToResponse({
        ...createdSale,
        receiptFileUrl,
      }),
    };
  }

  private validateQuantity(quantity: number): Result<boolean> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,

        error: 'Quantity must be an integer and more on than zero',
      };
    }
    if (quantity > 100) {
      return {
        success: false,
        error: 'Quantity cannot exceed 100 units',
      };
    }
    return {
      success: true,
      data: true,
    };
  }

  private validateUnitPrice(unitPrice: number): Result<boolean> {
    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
      return {
        success: false,
        error: 'Unit price must be a positive number',
      };
    }
    if (unitPrice > 100000) {
      return {
        success: false,
        error: 'Unit price cannot exceed 100000',
      };
    }
    return {
      success: true,
      data: true,
    };
  }

  private calculateTotalPrice(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
  }
}
