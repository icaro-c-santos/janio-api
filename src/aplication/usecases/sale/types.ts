import { Result } from '../../types/result';

export interface CreateSaleInput {
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  file: Express.Multer.File | null;
}

export interface CreateSaleResponse {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  receiptUrl?: string;
}
export interface ICreateSaleUseCase {
  execute(input: CreateSaleInput): Promise<Result<CreateSaleResponse>>;
}
