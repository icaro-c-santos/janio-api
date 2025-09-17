import { Address as AddressEntity } from '@prisma/client';
import { AddressDomain } from '../../../../domain/interfaces/address.interface';

export class AddressRepositoryMap {
  public static mapPrismaAddressToAddress(
    address: AddressEntity,
  ): AddressDomain {
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
}
