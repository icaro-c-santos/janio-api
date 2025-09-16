import { Result } from '../../types/result';
import { PaginatedResult } from '../shared/types';

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
  product: {
    id: string;
    name: string;
    description: string | null;
    price?: number;
  };
  customer: {
    userId: string;
    user: {
      id: string;
      type: 'INDIVIDUAL' | 'COMPANY';
      email?: string;
      individual?: {
        cpf: string;
        fullName: string;
        birthDate?: Date;
      };
      company?: {
        cnpj: string;
        legalName: string;
        tradeName?: string;
        stateRegistration?: string;
      };
    };
  };
}
export interface ICreateSaleUseCase {
  execute(input: CreateSaleInput): Promise<Result<CreateSaleResponse>>;
}
export interface GetAllSalesInput {
  page?: number;
  pageSize?: number;
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
  productId?: string;
}
export interface GetAllSalesResponse {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  receiptUrl?: string | null;
  product: {
    id: string;
    name: string;
    description: string | null;
    price?: number;
  };
  customer: {
    userId: string;
    user: {
      id: string;
      type: 'INDIVIDUAL' | 'COMPANY';
      email?: string;
      individual?: {
        cpf: string;
        fullName: string;
        birthDate?: Date;
      };
      company?: {
        cnpj: string;
        legalName: string;
        tradeName?: string;
        stateRegistration?: string;
      };
    };
  };
}
export interface IGetAllSalesUseCase {
  execute(
    filter: GetAllSalesInput,
  ): Promise<Result<PaginatedResult<GetAllSalesResponse>>>;
}
