import { Result } from '../../../shared/types/result';

export interface CreateAccountReceivableInput {
  amount: number;
  saleId?: string | null;
  expectedDate?: Date | null;
  metadata?: any | null;
  invoiceId?: string | null;
}

export interface CreateAccountReceivableResponse {
  id: string;
  amount: number;
  status: string;
  saleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  expectedDate: Date | null;
  metadata: any | null;
  invoiceId: string | null;
}

export interface ICreateAccountReceivableUseCase {
  execute(
    input: CreateAccountReceivableInput,
  ): Promise<Result<CreateAccountReceivableResponse>>;
}
