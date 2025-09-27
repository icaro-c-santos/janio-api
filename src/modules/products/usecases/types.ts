import { Result } from '../../shared/types/result';

export interface GetProductByIdInput {
  id: string;
}

export interface GetProductByIdResponse {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
}

export interface IGetProductByIdUseCase {
  execute(input: GetProductByIdInput): Promise<Result<GetProductByIdResponse>>;
}

export interface GetProductPriceByCustomerIdResponse {
  price: number;
}

export interface GetProductPriceByCustomerIdInput {
  customerId: string;
  productId: string;
}

export interface IGetProductPriceByCustomerIdUseCase {
  execute(
    input: GetProductPriceByCustomerIdInput,
  ): Promise<Result<GetProductPriceByCustomerIdResponse>>;
}
