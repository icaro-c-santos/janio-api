import {
  Company as CompanyEntity,
  Individual as IndividualEntity,
  User as UserEntity,
  Address as AddressEntity,
  Phone as PhoneEntity,
} from '@prisma/client';
import { AddressRepositoryMap } from './mapPrismaAddressToAddress.mapper';
import { PhoneRepositoryMap } from './mapPrismaPhoneToPhone.mapper';

export class UserRepositoryMap {
  public static mapPrismaUserToUser(
    user: UserEntity & {
      individual?: IndividualEntity;
      company?: CompanyEntity;
      addresses: AddressEntity[];
      phones: PhoneEntity[];
    },
  ) {
    return {
      id: user.id,
      type: user.type,
      email: user.email || undefined,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      individual: user.individual
        ? UserRepositoryMap.mapIndividual(user.individual)
        : undefined,
      company: user.company
        ? UserRepositoryMap.mapCompany(user.company)
        : undefined,
      addresses:
        user.addresses?.map((address) =>
          AddressRepositoryMap.mapPrismaAddressToAddress(address),
        ) || [],
      phones:
        user.phones?.map((phone) =>
          PhoneRepositoryMap.mapPrismaPhoneToPhone(phone),
        ) || [],
    };
  }

  private static mapIndividual(individual: IndividualEntity) {
    return {
      cpf: individual.cpf,
      fullName: individual.fullName,
      birthDate: individual.birthDate || undefined,
      deletedAt: individual.deletedAt,
    };
  }

  private static mapCompany(company: CompanyEntity) {
    return {
      cnpj: company.cnpj,
      legalName: company.legalName,
      tradeName: company.tradeName || undefined,
      stateRegistration: company.stateRegistration || undefined,
      deletedAt: company.deletedAt,
    };
  }
}
