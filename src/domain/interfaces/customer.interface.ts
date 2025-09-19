import { PhoneType } from '@prisma/client';
import { AddressDomain } from './address.interface';
import {
  RepositoryPaginatedInput,
  RepositoryPaginatedResult,
} from './shared/types';
import { UserDomain } from './user.interface';

export type CustomerFindAllParams = RepositoryPaginatedInput & {
  getOnlyPrimaryPhones?: boolean;
  getOnlyPrimaryAddresses?: boolean;
  email?: string;
  cpf?: string;
  cnpj?: string;
};

export type CreateCustomerData = {
  user: {
    type: 'INDIVIDUAL' | 'COMPANY';
    email: string;
    individual?: {
      cpf: string;
      fullName: string;
      birthDate?: Date;
    };
    company?: {
      cnpj: string;
      legalName: string;
      tradeName: string;
      stateRegistration: string;
    };
    address: Omit<AddressDomain, 'id'>;
    phone: {
      areaCode: string;
      isPrimary: boolean;
      isWhatsapp: boolean;
      type: PhoneType;
      number: string;
    };
  };
};

export interface ICustomerRepository {
  findById(id: string): Promise<CustomerDomain | null>;
  findAll(
    filter: CustomerFindAllParams,
  ): Promise<RepositoryPaginatedResult<CustomerDomain>>;
  create(customer: CreateCustomerData): Promise<CustomerDomain>;
}

export interface CustomerDomain {
  userId: string;
  user: UserDomain;
  deletedAt: Date | null;
}
