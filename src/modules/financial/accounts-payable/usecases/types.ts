import { Result } from '../../../shared/types/result';

export interface GetAccountPayByIdInput {
  id: string;
}

export interface GetAccountPayByIdResponse {
  id: string;
  description: string;
  totalValue: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentDate: Date | null;
  expenseId: string | null;
  paymentReceiptFileKey: string | null;
}

export interface IGetAccountPayByIdUseCase {
  execute(
    input: GetAccountPayByIdInput,
  ): Promise<Result<GetAccountPayByIdResponse>>;
}
