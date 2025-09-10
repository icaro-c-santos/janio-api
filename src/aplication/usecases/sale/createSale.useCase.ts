import { v4 as uuid } from 'uuid';
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

export class CreateSaleUseCase implements ICreateSaleUseCase {
  constructor(
    private saleRepository: ISaleRepository,
    private storageService: IStorageService,
    private customerRepository: ICustomerRepository,
    private productRepository: IProductRepository,
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
        status: 400,
        error: `Cannot find customer with id ${input.customerId}`,
      };
    }

    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      return {
        success: false,
        status: 400,
        error: `Cannot find product with id ${input.productId}`,
      };
    }

    const totalPrice = this.calculateTotalPrice(
      input.quantity,
      input.unitPrice,
    );
    const customerName =
      customer?.user?.company?.legalName ||
      customer?.user?.individual?.fullName ||
      'any';

    let receiptUrl: string | null = null;
    if (input.file) {
      const key = await this.uploadReceipt({
        file: input.file,
        customerName,
      });
      receiptUrl = await this.storageService.generateDownloadUrl({
        path: key,
      });
    }

    const saleData: CreateSaleData = {
      productId: input.productId,
      customerId: input.customerId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      saleDate: input.saleDate,
      totalPrice,
      receiptUrl,
    };

    const createdSale = await this.saleRepository.create(saleData);

    return {
      success: true,
      data: {
        id: createdSale.id,
        productId: createdSale.productId,
        customerId: createdSale.customerId,
        quantity: createdSale.quantity,
        unitPrice: createdSale.unitPrice,
        totalPrice: createdSale.totalPrice,
        saleDate: createdSale.saleDate,
        receiptUrl: createdSale.receiptUrl || null,
      },
    };
  }

  private async uploadReceipt({
    file,
    customerName,
  }: {
    file: Express.Multer.File;
    customerName: string;
  }) {
    const uniqueId = uuid();
    const extension = file.originalname.split('.').pop();
    const key = `receipts/${customerName}_${uniqueId}.${extension}`;

    await this.storageService.uploadFile({
      buffer: file.buffer,
      key,
      contentType: file.mimetype,
    });
    return key;
  }

  private validateQuantity(quantity: number): Result<boolean> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        status: 400,
        error: 'Quantity must be an integer and more on than zero',
      };
    }
    if (quantity > 100) {
      return {
        success: false,
        status: 400,
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
        status: 400,
        error: 'Unit price must be a positive number',
      };
    }
    if (unitPrice > 100000) {
      return {
        success: false,
        status: 400,
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
