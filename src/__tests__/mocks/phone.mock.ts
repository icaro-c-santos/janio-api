import { Phone as PhoneEntity } from '@prisma/client';
import {
  EPhoneType,
  PhoneDomain,
} from '../../domain/interfaces/phone.interface';
import { faker } from './faker';

export function createPhoneMock(options?: Partial<PhoneEntity>): PhoneDomain {
  const type: EPhoneType =
    (options?.type as unknown as EPhoneType) ||
    faker.helpers.arrayElement([EPhoneType.FIXED, EPhoneType.MOBILE]);

  // Gerar DDD aleatório do Brasil (11-99)
  const areaCode =
    options?.areaCode || faker.number.int({ min: 11, max: 99 }).toString();

  const numberLength = type === EPhoneType.MOBILE ? 9 : 8;
  const number = options?.number || faker.string.numeric(numberLength);

  return {
    areaCode,
    number,
    type,
    isPrimary: options?.isPrimary ?? faker.datatype.boolean(),
    isWhatsapp:
      (options?.isWhatsapp as unknown as boolean) ??
      ((type === EPhoneType.MOBILE
        ? faker.datatype.boolean()
        : false) as unknown as boolean),
    id: faker.string.uuid(),
  };
}
