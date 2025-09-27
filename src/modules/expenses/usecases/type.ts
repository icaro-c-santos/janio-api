/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  PaginatedResult,
  PaginatedUseCase,
} from '../../shared/types/pagination';
import { Result } from '../../shared/types/result';

export interface BaseExpenseResponse {
  id: string;
  expenseTypeId: string | null;
  description: string;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
  receiptFileKey: string | null;
  receiptFileUrl: string | null;
  expenseType: ExpenseTypeResponse | null;
}

export interface CreateExpenseInput {
  expenseTypeId?: string;
  accountPayId?: string;
  description: string;
  totalValue: number;
  receiptFile?: Express.Multer.File;
}
export interface ExpenseTypeResponse {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateExpenseResponse extends BaseExpenseResponse {}

export interface ICreateExpenseUseCase {
  execute(input: CreateExpenseInput): Promise<Result<CreateExpenseResponse>>;
}

export interface GetExpenseByIdInput {
  id: string;
}

export interface GetExpenseByIdResponse extends BaseExpenseResponse {}

export interface IGetExpenseByIdUseCase {
  execute(input: GetExpenseByIdInput): Promise<Result<GetExpenseByIdResponse>>;
}

export interface GetAllExpenseInput extends PaginatedUseCase {}

export type GetAllExpenseResponse = Promise<
  Result<PaginatedResult<BaseExpenseResponse>>
>;

export interface IGetAllExpenseUseCase {
  execute(input: GetAllExpenseInput): GetAllExpenseResponse;
}
