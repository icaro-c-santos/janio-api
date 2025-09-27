import { AddressDomain } from './address.interface';
import { PhoneDomain } from './phone.interface';

export interface UserDomain {
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
  createdAt: Date;
  deletedAt: Date | null;
  phones: PhoneDomain[];
  addresses: AddressDomain[];
}
