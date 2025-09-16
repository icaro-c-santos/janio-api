import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from './shared/types';

export interface ISaleRepository {
  create(sale: CreateSaleData): Promise<Sale>;
  getAll(filter: GetSalesFilter): Promise<RepositoryPaginatedResult<Sale>>;
}

export interface GetSalesFilter extends RepositoryPaginatedInput {
  startDate?: Date;
  endDate?: Date;
  customerId?: string;
  productId?: string;
}

export interface CreateSaleData {
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  receiptUrl: string | null;
}

export interface Sale {
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
