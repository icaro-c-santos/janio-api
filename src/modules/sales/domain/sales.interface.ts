import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from '../../shared/types/repository';

export interface ISaleRepository {
  create(sale: CreateSaleData): Promise<SaleDomain>;
  findById(id: string): Promise<SaleDomain | null>;
  getAll(
    filter: GetSalesFilter,
  ): Promise<RepositoryPaginatedResult<SaleDomain>>;
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
  receiptFileKey: string | null;
}

export interface SaleDomain {
  id: string;
  productId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  saleDate: Date;
  receiptFileKey?: string | null;
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
