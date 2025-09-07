import { PaginatedResult } from '../shared/types';
import { Result } from '../../types/result';

export interface GetAllCustomersInput {
  page?: number;
  pageSize?: number;
}

export interface GetAllCustomersResponsePhone {
  id: string;
  areaCode: string;
  isPrimary: boolean;
  isWhatsapp: boolean;
  type: 'FIXED' | 'MOBILE';
  number: string;
}

export interface GetAllCustomersResponseAddress {
  city: string;
  country: string;
  district: string;
  state: string;
  number: string;
  street: string;
  postalCode: string;
  id: string;
  isPrimary: boolean;
}

export interface GetAllCustomersResponse {
  userId: string;
  user: {
    id: string;
    type: 'INDIVIDUAL' | 'COMPANY';
    email?: string;
    individual?: {
      cpf: string;
      fullName: string;
      birthDate?: Date;
      deletedAt: Date | null;
    };
    company?: {
      cnpj: string;
      legalName: string;
      tradeName?: string;
      stateRegistration?: string;
      deletedAt: Date | null;
    };
    primaryAddress: GetAllCustomersResponseAddress | null;
    address: GetAllCustomersResponseAddress[];
    primaryPhone: GetAllCustomersResponsePhone | null;
    phones: GetAllCustomersResponsePhone[];
    createdAt: Date;
    deletedAt: Date | null;
  };
  deletedAt: Date | null;
}

export interface IGetAllCustomersUseCase {
  execute(
    input: GetAllCustomersInput,
  ): Promise<Result<PaginatedResult<GetAllCustomersResponse>>>;
}
