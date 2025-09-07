import { Address } from '../../../../domain/interfaces/address.interface';
import { Customer } from '../../../../domain/interfaces/customer.interface';
import {
  Phone,
  EPhoneType,
} from '../../../../domain/interfaces/phone.interface';
import {
  GetAllCustomersResponse,
  GetAllCustomersResponseAddress,
  GetAllCustomersResponsePhone,
} from '../types';

export class CustomerMapResponse {
  public static mapAddress(address: Address): GetAllCustomersResponseAddress {
    return {
      id: address.id,
      city: address.city,
      country: address.country,
      district: address.district,
      state: address.state,
      number: address.number,
      street: address.street,
      postalCode: address.postalCode,
      isPrimary: address.isPrimary,
    };
  }

  public static mapPhone(phone: Phone): GetAllCustomersResponsePhone {
    return {
      id: phone.id,
      areaCode: phone.areaCode,
      number: phone.number,
      type: phone.type === EPhoneType.FIXED ? 'FIXED' : 'MOBILE',
      isPrimary: phone.isPrimary,
      isWhatsapp: phone.isWhatsapp,
    };
  }

  public static mapCustomerToResponse(
    customer: Customer,
  ): GetAllCustomersResponse {
    return {
      userId: customer.userId,
      deletedAt: customer.deletedAt,
      user: {
        id: customer.user.id,
        type: customer.user.type,
        email: customer.user.email,
        individual: customer.user.individual
          ? {
              cpf: customer.user.individual.cpf,
              fullName: customer.user.individual.fullName,
              birthDate: customer.user.individual.birthDate,
              deletedAt: customer.user.individual.deletedAt,
            }
          : undefined,
        company: customer.user.company
          ? {
              cnpj: customer.user.company.cnpj,
              legalName: customer.user.company.legalName,
              tradeName: customer.user.company.tradeName,
              stateRegistration: customer.user.company.stateRegistration,
              deletedAt: customer.user.company.deletedAt,
            }
          : undefined,
        primaryAddress: customer.user.addresses.find((a) => a.isPrimary)
          ? this.mapAddress(customer.user.addresses.find((a) => a.isPrimary)!)
          : null,
        address: customer.user.addresses.map(this.mapAddress),
        primaryPhone: customer.user.phones.find((p) => p.isPrimary)
          ? this.mapPhone(customer.user.phones.find((p) => p.isPrimary)!)
          : null,
        phones: customer.user.phones.map(this.mapPhone),
        createdAt: customer.user.createdAt,
        deletedAt: customer.user.deletedAt,
      },
    };
  }
}
