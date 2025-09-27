import {
  CreateExpenseData,
  IExpenseRepository,
} from '../domain/expense.interface';
import { Result } from '../../shared/types/result';
import { ExpenseMapResponse } from './mappers/expenseToExpenseResponse.mapper';
import { ReceiptExpenseService } from './services/receipt-expense.service';
import {
  CreateExpenseInput,
  CreateExpenseResponse,
  ICreateExpenseUseCase,
} from './type';

export class CreateExpenseUseCase implements ICreateExpenseUseCase {
  constructor(
    private readonly expenseRepository: IExpenseRepository,
    private readonly receiptExpenseService: ReceiptExpenseService,
  ) {}

  async execute(
    input: CreateExpenseInput,
  ): Promise<Result<CreateExpenseResponse>> {
    let receiptFileKey = null;

    if (input?.expenseTypeId) {
      const expenseType = await this.expenseRepository.getExpenseTypeById(
        input.expenseTypeId,
      );
      if (!expenseType) {
        return {
          success: false,
          error: 'Expense type not found',
        };
      }
    }

    if (input?.accountPayId) {
      const accountPay = await this.expenseRepository.getById(
        input.accountPayId,
      );
      if (!accountPay) {
        return {
          success: false,
          error: 'Account pay not found',
        };
      }
    }

    if (input.receiptFile) {
      receiptFileKey = await this.receiptExpenseService.upload(
        input.receiptFile,
      );
    }
    const data: CreateExpenseData = {
      accountPayId: input.accountPayId || null,
      description: input.description,
      expenseTypeId: input.expenseTypeId || null,
      receiptFileKey,
      totalValue: input.totalValue,
    };

    const expense = await this.expenseRepository.create(data);

    return {
      success: true,
      data: ExpenseMapResponse.mapExpenseToResponse(expense),
    };
  }
}
