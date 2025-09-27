import {
  Expense as ExpenseEntity,
  ExpenseType as ExpenseTypeEntity,
} from '@prisma/client';
import {
  ExpenseDomain,
  ExpenseTypeDomain,
} from '../../domain/expense.interface';

export class ExpenseRepositoryMap {
  public static mapPrismaExpenseToExpense(
    expense: ExpenseEntity & {
      expenseType: ExpenseTypeEntity | null;
    },
  ): ExpenseDomain {
    return {
      id: expense.id,
      expenseTypeId: expense?.expenseTypeId || null,
      description: expense.description,
      totalValue: Number(expense.totalValue),
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
      receiptFileKey: expense?.receiptFileKey || null,
      expenseType: expense.expenseType
        ? ExpenseRepositoryMap.mapPrismaExpenseTypeToExpenseType(
            expense.expenseType,
          )
        : null,
    };
  }

  public static mapPrismaExpenseTypeToExpenseType(
    expenseType: ExpenseTypeEntity,
  ): ExpenseTypeDomain {
    return {
      id: expenseType.id,
      name: expenseType.name,
      description: expenseType.description || null,
    };
  }
}
