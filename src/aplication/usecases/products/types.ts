import { Result } from '../../types/result';

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
