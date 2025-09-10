import { Result } from '../../types/result';

export interface CreateSaleInput {
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  saleDate: Date;
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
  receiptUrl: string | null;
}
export interface ICreateSaleUseCase {
  execute(input: CreateSaleInput): Promise<Result<CreateSaleResponse>>;
}
