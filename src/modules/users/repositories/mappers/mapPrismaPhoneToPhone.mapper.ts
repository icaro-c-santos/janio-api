import { Phone as PhoneEntity, PhoneType } from '@prisma/client';
import { EPhoneType, PhoneDomain } from '../../domain/phone.interface';

export class PhoneRepositoryMap {
  public static mapPrismaPhoneToPhone(phone: PhoneEntity): PhoneDomain {
    const type =
      phone.type === PhoneType.FIXED ? EPhoneType.FIXED : EPhoneType.MOBILE;

    return {
      id: phone.id,
      areaCode: phone.areaCode,
      number: phone.number,
      isPrimary: phone.isPrimary,
      isWhatsapp: phone.isWhatsapp,
      type,
    };
  }
}
