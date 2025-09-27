import {
  ExpenseDomain,
  ExpenseTypeDomain,
} from '../../domain/expense.interface';
import { CreateExpenseResponse, ExpenseTypeResponse } from '../type';

export class ExpenseMapResponse {
  public static mapExpenseToResponse(
    expense: ExpenseDomain & {
      receiptFileUrl?: string | null;
    },
  ): CreateExpenseResponse {
    return {
      id: expense.id,
      expenseTypeId: expense?.expenseTypeId || null,
      description: expense.description,
      totalValue: Number(expense.totalValue),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      receiptFileKey: expense?.receiptFileKey || null,
      receiptFileUrl: expense?.receiptFileUrl || null,
      expenseType: expense.expenseType
        ? ExpenseMapResponse.mapExpenseTypeToResponse(expense.expenseType)
        : null,
    };
  }

  public static mapExpenseTypeToResponse(
    expense: ExpenseTypeDomain,
  ): ExpenseTypeResponse {
    return {
      id: expense.id,
      name: expense.name,
      description: expense.description || null,
    };
  }
}
