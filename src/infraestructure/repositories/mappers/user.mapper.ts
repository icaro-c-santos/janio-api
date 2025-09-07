import {
  Company as CompanyEntity,
  Individual as IndividualEntity,
  User as UserEntity,
  Address as AddressEntity,
  Phone as PhoneEntity,
  PhoneType,
} from '@prisma/client';
import { EPhoneType } from '../../../domain/interfaces/phone.interface';

export class UserMap {
  public static mapUser(
    user: UserEntity & {
      individual?: IndividualEntity | null;
      company?: CompanyEntity | null;
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
        ? UserMap.mapIndividual(user.individual)
        : undefined,
      company: user.company ? UserMap.mapCompany(user.company) : undefined,
      addresses: user.addresses.map((address) => UserMap.mapAddress(address)),
      phones: user.phones.map((phone) => UserMap.mapPhone(phone)),
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

  private static mapAddress(address: AddressEntity) {
    return {
      city: address.city,
      country: address.country,
      district: address.district,
      state: address.state,
      number: address.number,
      street: address.street,
      postalCode: address.postalCode,
      id: address.id,
      isPrimary: address.isPrimary,
    };
  }

  private static mapPhone(phone: PhoneEntity) {
    const type =
      phone.type === PhoneType.FIXED ? EPhoneType.FIXED : EPhoneType.MOBILE;
    return {
      id: phone.id,
      areaCode: phone.areaCode,
      isPrimary: phone.isPrimary,
      isWhatsapp: phone.isWhatsapp,
      type,
      number: phone.number,
    };
  }
}
