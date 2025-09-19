import { PaginatedResult } from '../shared/types';
import { Result } from '../../types/result';
import { EPhoneType } from '../../../domain/interfaces/phone.interface';

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

export interface CreateCustomerBaseUser {
  email: string;
  address: {
    city: string;
    country: string;
    district: string;
    state: string;
    number: string;
    street: string;
    postalCode: string;
  };
  phone: {
    areaCode: string;
    isWhatsapp: boolean;
    type: EPhoneType;
    number: string;
  };
}

export interface CreateCustomerIndividualUser extends CreateCustomerBaseUser {
  type: 'INDIVIDUAL';
  individual: {
    cpf: string;
    fullName: string;
    birthDate?: Date;
  };
  company?: never;
}

export interface CreateCustomerCompanyUser extends CreateCustomerBaseUser {
  type: 'COMPANY';
  company: {
    cnpj: string;
    legalName: string;
    tradeName: string;
    stateRegistration: string;
  };
  individual?: never;
}

export type CreateCustomerInput = {
  user: CreateCustomerIndividualUser | CreateCustomerCompanyUser;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CreateCustomerResponse extends GetAllCustomersResponse {}

export interface ICreateCustomerUseCase {
  execute(input: CreateCustomerInput): Promise<Result<CreateCustomerResponse>>;
}
