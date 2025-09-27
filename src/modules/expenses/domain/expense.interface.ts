import { RepositoryPaginatedInput } from '../../shared/types/repository';

export type ExpenseFindAllParams = RepositoryPaginatedInput & {};

export type CreateExpenseData = {
  expenseTypeId: string | null;
  accountPayId: string | null;
  description: string;
  totalValue: number;
  receiptFileKey: string | null;
};

export interface IExpenseRepository {
  getAll(filter: ExpenseFindAllParams): Promise<ExpenseDomain[]>;
  getById(id: string): Promise<ExpenseDomain | null>;
  getAllCategories(): Promise<ExpenseTypeDomain[]>;
  getExpenseTypeById(id: string): Promise<ExpenseTypeDomain | null>;
  create(expense: CreateExpenseData): Promise<ExpenseDomain>;
}

export interface ExpenseTypeDomain {
  id: string;
  name: string;
  description: string | null;
}

export interface ExpenseDomain {
  id: string;
  expenseTypeId: string | null;
  description: string;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
  receiptFileKey: string | null;
  expenseType: ExpenseTypeDomain | null;
}
