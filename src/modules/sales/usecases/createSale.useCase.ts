import {
  CreateSaleResponse,
  ICreateSaleUseCase,
  CreateSaleInput,
} from '../types';
import { IProductRepository } from '../../products/domain/product.interface';
import { SaleMapResponse } from './mappers/mapSaleToSaleResponse.mapper';
import { ReceiptService } from '../services/receipt.service';
import { CreateSaleData } from '../domain/sales.interface';
import { ICustomerRepository } from '../../customers/domain/customer.interface';
import { ITransaction } from '../../shared/types/transactions';
import { BillingPlanService } from '../../financial/billing-plan/services/billingPlanService ';

interface LoadInputResult {
  customerId: string;
  productId: string;
  customer: any;
  product: any;
  totalPrice: number;
  expectedDate: Date;
  receiptFileKey: string | null;
  receiptFileUrl: string | null;
}

export class CreateSaleUseCase implements ICreateSaleUseCase {
  constructor(
    private transaction: ITransaction,
    private customerRepository: ICustomerRepository,
    private productRepository: IProductRepository,
    private receiptService: ReceiptService,
    private billingPlanService: BillingPlanService,
  ) {}

  async execute(input: CreateSaleInput): Promise<CreateSaleResponse> {
    const loadResult = await this.loadInput(input);

    const createdSaleData: CreateSaleData = {
      productId: loadResult.productId,
      customerId: loadResult.customerId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      saleDate: input.saleDate,
      totalPrice: loadResult.totalPrice,
      receiptFileKey: loadResult.receiptFileKey,
    };

    const createdSale = await this.transaction.run(async (tx) => {
      const sale = await tx.saleRepository.create(createdSaleData);
      await tx.accountReceivableRepository.create({
        saleId: sale.id,
        amount: loadResult.totalPrice,
        expectedDate: loadResult.expectedDate,
      });
      return sale;
    });

    return SaleMapResponse.mapSaleToResponse({
      ...createdSale,
      receiptFileUrl: loadResult.receiptFileUrl,
    });
  }

  private async loadInput(input: CreateSaleInput): Promise<LoadInputResult> {
    this.validateQuantity(input.quantity);
    this.validateUnitPrice(input.unitPrice);

    const [customer, product, expectedDate] = await Promise.all([
      this.customerRepository.findById(input.customerId),
      this.productRepository.findById(input.productId),
      this.billingPlanService.calculateExpectedDate(
        input.customerId,
        input.productId,
        input.saleDate,
      ),
    ]);

    if (!customer)
      throw new Error(`Cannot find customer with id ${input.customerId}`);
    if (!product)
      throw new Error(`Cannot find product with id ${input.productId}`);

    const totalPrice = this.calculateTotalPrice(
      input.quantity,
      input.unitPrice,
    );

    let receiptFileKey: string | null = null;
    let receiptFileUrl: string | null = null;

    if (input.file) {
      receiptFileKey = await this.receiptService.upload(input.file, customer);
      receiptFileUrl = await this.receiptService.getUrl(receiptFileKey);
    }

    return {
      customerId: customer.userId,
      productId: product.id,
      customer,
      product,
      totalPrice,
      expectedDate,
      receiptFileKey,
      receiptFileUrl,
    };
  }

  private validateQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
    if (quantity > 100) {
      throw new Error('Quantity cannot exceed 100 units');
    }
  }

  private validateUnitPrice(unitPrice: number): void {
    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
      throw new Error('Unit price must be a positive number');
    }
    if (unitPrice > 100_000) {
      throw new Error('Unit price cannot exceed 100000');
    }
  }

  private calculateTotalPrice(quantity: number, unitPrice: number): number {
    return Math.round(quantity * unitPrice * 100) / 100;
  }
}
